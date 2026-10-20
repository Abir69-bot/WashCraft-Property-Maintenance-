import { ImageResponse } from 'next/og'

import { MARK_PATHS } from '@/components/brand/logo'
import { site } from '@/config/site'

// Default social-share image. Pages with their own image override it (Phase 7).
export const alt = site.name
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const SERVICES = [
  'Exterior cleaning',
  'Interior cleaning',
  'Winter services',
  'Holiday lighting',
  'Yard care',
]

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: '#0E4D64',
        color: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <svg width="120" height="120" viewBox="0 0 48 48">
          <path
            d={MARK_PATHS.roof}
            fill="none"
            stroke="#fff"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d={MARK_PATHS.drop} fill="#2CB1BC" />
          <path
            d={MARK_PATHS.shine}
            fill="none"
            stroke="#fff"
            strokeWidth={2.25}
            strokeLinecap="round"
          />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>{site.shortName}</div>
          <div style={{ fontSize: 28, letterSpacing: 6, color: '#68C7CF' }}>
            PROPERTY MAINTENANCE
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {SERVICES.map((service) => (
          <div
            key={service}
            style={{
              display: 'flex',
              padding: '12px 24px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              fontSize: 28,
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
