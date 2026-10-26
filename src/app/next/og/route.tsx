import { readFile } from 'fs/promises'
import { ImageResponse } from 'next/og'
import path from 'path'

import logo from '@/assets/brand/washcraft-logo.png'
import { OG_SIZE, readOgCard } from '@/lib/seo/og'

/** Share image for a page without its own photo: logo, eyebrow and title on the brand color. */
export async function GET(request: Request) {
  const card = readOgCard(new URL(request.url).searchParams)
  if (!card) return new Response('Not found', { status: 404 })

  const file = await readFile(path.join(process.cwd(), 'src/assets/brand/washcraft-logo.png'))
  const logoSrc = `data:image/png;base64,${file.toString('base64')}`
  const logoWidth = 280
  const size = card.title.length > 60 ? 60 : card.title.length > 36 ? 72 : 84

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {card.eyebrow && (
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#F5B700' }}>
            {card.eyebrow.toUpperCase()}
          </div>
        )}
        <div style={{ display: 'flex', fontSize: size, fontWeight: 800, lineHeight: 1.1 }}>
          {card.title}
        </div>
      </div>
      <div style={{ display: 'flex', height: 10, width: 220, background: '#2CB1BC' }} />
    </div>,
    {
      ...OG_SIZE,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  )
}
