import type { Season } from '@/config/catalog'
import { activeSeasons, currentSeason, seasonRanges } from '@/lib/seasons'

import type { LayoutData } from './layout'

/** Today's season, worked out at render time (pages rebuild daily). */
export function seasonNow(
  layout: Pick<LayoutData, 'seasonal' | 'heroVariants'>,
  date = new Date(),
) {
  const ranges = seasonRanges(layout.seasonal.seasons)
  const active = activeSeasons(date, ranges) as Season[]
  const season = currentSeason(date, ranges, layout.seasonal.heroOverride)
  const variant =
    layout.heroVariants.find((item) => item.season === season) ??
    layout.heroVariants.find((item) => item.season === 'all-year') ??
    layout.heroVariants[0] ??
    null
  return { season, active, variant }
}
