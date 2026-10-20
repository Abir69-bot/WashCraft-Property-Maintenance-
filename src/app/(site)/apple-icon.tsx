import { ImageResponse } from 'next/og'

import { MARK_PATHS } from '@/components/brand/logo'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0E4D64',
      }}
    >
      <svg width="132" height="132" viewBox="0 0 48 48">
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
    </div>,
    size,
  )
}
