import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { mkdir, open, readdir, readFile, rm, stat, writeFile } from 'fs/promises'
import path from 'path'

export type StoredObject = { body: Uint8Array; contentType: string }
export type ObjectInfo = { size: number; contentType: string }
/** Where the browser sends one file (a presigned R2 URL, or our own upload route locally). */
export type UploadTarget = { url: string; headers: Record<string, string> }

/**
 * Private file storage: customer uploads, failed-lead backups. R2 in production, a local folder
 * in development and tests. Keys are made by the server (see `isSafeKey`).
 */
export interface ObjectStore {
  readonly kind: 'r2' | 'local'
  put(key: string, body: Uint8Array | string, contentType: string): Promise<void>
  get(key: string): Promise<StoredObject | null>
  head(key: string): Promise<ObjectInfo | null>
  /** The first bytes of an object, for file type checks. */
  readStart(key: string, bytes: number): Promise<Uint8Array | null>
  list(prefix: string): Promise<string[]>
  delete(key: string): Promise<void>
  uploadTarget(key: string, contentType: string, size: number): Promise<UploadTarget>
}

/** Lowercase path segments of letters, digits, dots, dashes and underscores; no "..". */
export const isSafeKey = (key: string) =>
  /^[a-z0-9_-]+(\/[a-z0-9_][a-z0-9_.-]*)+$/.test(key) && !key.includes('..')

function assertSafeKey(key: string) {
  if (!isSafeKey(key)) throw new Error(`Unsafe storage key: ${key}`)
}

const notFound = (error: unknown) => {
  const name = (error as { name?: string })?.name
  const status = (error as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode
  return name === 'NoSuchKey' || name === 'NotFound' || status === 404
}

export type R2Settings = {
  bucket: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
}

/** Cloudflare R2 or any S3-compatible store (MinIO in tests). */
export class S3ObjectStore implements ObjectStore {
  readonly kind = 'r2' as const
  private readonly client: S3Client
  private readonly bucket: string

  constructor(settings: R2Settings) {
    this.bucket = settings.bucket
    this.client = new S3Client({
      region: 'auto',
      endpoint: settings.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: settings.accessKeyId,
        secretAccessKey: settings.secretAccessKey,
      },
    })
  }

  async put(key: string, body: Uint8Array | string, contentType: string) {
    assertSafeKey(key)
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType }),
    )
  }

  async get(key: string) {
    assertSafeKey(key)
    try {
      const result = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }))
      const body = await result.Body!.transformToByteArray()
      return { body, contentType: result.ContentType ?? 'application/octet-stream' }
    } catch (error) {
      if (notFound(error)) return null
      throw error
    }
  }

  async head(key: string) {
    assertSafeKey(key)
    try {
      const result = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      )
      return {
        size: result.ContentLength ?? 0,
        contentType: result.ContentType ?? 'application/octet-stream',
      }
    } catch (error) {
      if (notFound(error)) return null
      throw error
    }
  }

  async readStart(key: string, bytes: number) {
    assertSafeKey(key)
    try {
      const result = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key, Range: `bytes=0-${bytes - 1}` }),
      )
      return await result.Body!.transformToByteArray()
    } catch (error) {
      if (notFound(error)) return null
      throw error
    }
  }

  async list(prefix: string) {
    const keys: string[] = []
    let token: string | undefined
    do {
      const page = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: token,
        }),
      )
      keys.push(...(page.Contents ?? []).flatMap((item) => (item.Key ? [item.Key] : [])))
      token = page.IsTruncated ? page.NextContinuationToken : undefined
    } while (token)
    return keys.sort()
  }

  async delete(key: string) {
    assertSafeKey(key)
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }

  /** Presigned PUT valid for 10 minutes. Type and exact size are part of the signature. */
  async uploadTarget(key: string, contentType: string, size: number) {
    assertSafeKey(key)
    const url = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
        ContentLength: size,
      }),
      { expiresIn: 600, signableHeaders: new Set(['content-type', 'content-length']) },
    )
    return { url, headers: { 'Content-Type': contentType } }
  }
}

/**
 * A folder on disk, for development and tests. Content types are kept in a sidecar
 * `.type` file. Uploads go through `/next/upload` (see `localUploadUrl`).
 */
export class LocalObjectStore implements ObjectStore {
  readonly kind = 'local' as const

  constructor(
    private readonly root: string,
    private readonly signUpload: (key: string, contentType: string, size: number) => string,
  ) {}

  private file(key: string) {
    assertSafeKey(key)
    return path.join(this.root, ...key.split('/'))
  }

  async put(key: string, body: Uint8Array | string, contentType: string) {
    const file = this.file(key)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, body)
    await writeFile(`${file}.type`, contentType)
  }

  async get(key: string) {
    const file = this.file(key)
    try {
      const [body, contentType] = await Promise.all([
        readFile(file),
        readFile(`${file}.type`, 'utf8').catch(() => 'application/octet-stream'),
      ])
      return { body: new Uint8Array(body), contentType }
    } catch {
      return null
    }
  }

  async head(key: string) {
    const file = this.file(key)
    try {
      const [info, contentType] = await Promise.all([
        stat(file),
        readFile(`${file}.type`, 'utf8').catch(() => 'application/octet-stream'),
      ])
      return { size: info.size, contentType }
    } catch {
      return null
    }
  }

  async readStart(key: string, bytes: number) {
    let handle
    try {
      handle = await open(this.file(key), 'r')
      const buffer = new Uint8Array(bytes)
      const { bytesRead } = await handle.read(buffer, 0, bytes, 0)
      return buffer.slice(0, bytesRead)
    } catch {
      return null
    } finally {
      await handle?.close()
    }
  }

  async list(prefix: string) {
    const walk = async (dir: string): Promise<string[]> => {
      const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
      const nested = await Promise.all(
        entries.map((entry) =>
          entry.isDirectory()
            ? walk(path.join(dir, entry.name))
            : Promise.resolve(entry.name.endsWith('.type') ? [] : [path.join(dir, entry.name)]),
        ),
      )
      return nested.flat()
    }
    const files = await walk(this.root)
    return files
      .map((file) => path.relative(this.root, file).split(path.sep).join('/'))
      .filter((key) => key.startsWith(prefix))
      .sort()
  }

  async delete(key: string) {
    const file = this.file(key)
    await rm(file, { force: true })
    await rm(`${file}.type`, { force: true })
  }

  async uploadTarget(key: string, contentType: string, size: number) {
    assertSafeKey(key)
    return {
      url: this.signUpload(key, contentType, size),
      headers: { 'Content-Type': contentType },
    }
  }
}
