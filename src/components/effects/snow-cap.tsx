import { SNOW_OVERRIDE_SCRIPT } from './snow-settings'
import './snow-cap.css'

/**
 * Effect 3 (owner, 2026-11-23): settled snow along the bottom edge of the site header in winter,
 * with small holiday lights in brand colours while the holiday season runs (they hint at the
 * Christmas light service). It's all CSS on the header's ::before and ::after (snow-cap.css), so
 * the header itself is untouched; this only renders the markers that CSS looks for.
 */
export function SnowCap({ winter, lights }: { winter: boolean; lights: boolean }) {
  return (
    <>
      {winter && <span hidden data-snow-cap="" />}
      {lights && <span hidden data-snow-lights="" />}
      <script dangerouslySetInnerHTML={{ __html: SNOW_OVERRIDE_SCRIPT }} />
    </>
  )
}
