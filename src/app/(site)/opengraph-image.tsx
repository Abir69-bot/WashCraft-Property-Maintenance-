import { readFile } from 'fs/promises'
import { ImageResponse } from 'next/og'
import path from 'path'

import logo from '@/assets/brand/washcraft-logo.png'
import { site } from '@/config/site'

// Default social-share image. Pages with their own image override it (Phase 7).
export const alt = site.name
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const SERVICES = ['Exterior cleaning', 'Interior cleaning', 'Snow removal', 'Holiday lighting']

export default async function OpengraphImage() {
  const file = await readFile(path.join(process.cwd(), 'src/assets/brand/washcraft-logo.png'))
  const logoSrc = `data:image/png;base64,${file.toString('base64')}`
  const logoWidth = 500

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 56,
        padding: '0 72px',
        background: '#0E4D64',
        color: '#fff',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img> only */}
      <img
        src={logoSrc}
        width={logoWidth}
        height={Math.round((logoWidth * logo.height) / logo.width)}
        alt=""
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {SERVICES.map((service) => (
          <div
            key={service}
            style={{
              display: 'flex',
              padding: '14px 28px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              fontSize: 34,
            }}
          >
            {service}
          </div>
        ))}
      </div>
    </div>,
    size,
  )
}
