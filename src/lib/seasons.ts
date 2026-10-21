import type { Season } from '@/config/catalog'

/** A yearly date range; it may wrap the new year (winter: Nov 1 – Mar 31). */
export type SeasonRange = {
  startMonth: number | string
  startDay: number
  endMonth: number | string
  endDay: number
}

export type DatedSeason = Exclude<Season, 'all-year'>
export type SeasonRanges = Record<DatedSeason, SeasonRange>

/** Brief §7 defaults: winter Nov–Mar, holiday Oct–Jan. */
export const DEFAULT_SEASONS: SeasonRanges = {
  spring: { startMonth: 3, startDay: 1, endMonth: 5, endDay: 31 },
  summer: { startMonth: 6, startDay: 1, endMonth: 8, endDay: 31 },
  fall: { startMonth: 9, startDay: 1, endMonth: 11, endDay: 30 },
  winter: { startMonth: 11, startDay: 1, endMonth: 3, endDay: 31 },
  holiday: { startMonth: 10, startDay: 1, endMonth: 1, endDay: 31 },
}

const DATED: DatedSeason[] = ['spring', 'summer', 'fall', 'winter', 'holiday']

/** Day of year on a fixed 366-day calendar, so ranges behave the same every year. */
const dayOf = (month: number, day: number) => month * 32 + day
const today = (date: Date) => dayOf(date.getUTCMonth() + 1, date.getUTCDate())
const start = (range: SeasonRange) => dayOf(Number(range.startMonth), range.startDay)
const end = (range: SeasonRange) => dayOf(Number(range.endMonth), range.endDay)

export function isInRange(date: Date, range: SeasonRange): boolean {
  const d = today(date)
  const [from, to] = [start(range), end(range)]
  return from <= to ? d >= from && d <= to : d >= from || d <= to
}

/** Days since the range began, counting back across the new year when needed. */
function daysSinceStart(date: Date, range: SeasonRange) {
  const elapsed = today(date) - start(range)
  return elapsed >= 0 ? elapsed : elapsed + dayOf(12, 32)
}

/** Seasons in effect on `date`, the one that began most recently first. */
export function activeSeasons(date: Date, ranges: SeasonRanges = DEFAULT_SEASONS): DatedSeason[] {
  return DATED.filter((season) => isInRange(date, ranges[season])).sort(
    (a, b) => daysSinceStart(date, ranges[a]) - daysSinceStart(date, ranges[b]),
  )
}

/**
 * The season that drives the home page hero and announcement bar: the one that began most
 * recently (October → holiday booking, November → snow contracts, March → spring cleaning).
 */
export function currentSeason(
  date: Date,
  ranges: SeasonRanges = DEFAULT_SEASONS,
  override?: string | null,
): Season {
  if (override && override !== 'auto') return override as Season
  return activeSeasons(date, ranges)[0] ?? 'all-year'
}

/** True when a service with these seasons is bookable now (all-year services always are). */
export function isInSeason(seasons: readonly string[] | null | undefined, active: Season[]) {
  if (!seasons?.length || seasons.includes('all-year')) return true
  return seasons.some((season) => active.includes(season as Season))
}

/**
 * Seasonal (not all-year) services that are in season now, for the "In season now" spotlight.
 * `active` is newest season first, so the current season's services lead.
 */
export function inSeasonNow<T extends { seasons?: readonly string[] | null }>(
  services: T[],
  active: Season[],
): T[] {
  const rank = (service: T) =>
    Math.min(
      ...(service.seasons ?? []).map((season) => {
        const index = active.indexOf(season as Season)
        return index === -1 ? Infinity : index
      }),
    )
  return services
    .filter((service) => service.seasons?.length && !service.seasons.includes('all-year'))
    .map((service) => ({ service, rank: rank(service) }))
    .filter(({ rank }) => rank !== Infinity)
    .sort((a, b) => a.rank - b.rank)
    .map(({ service }) => service)
}

/** Season ranges from the admin's Seasonal settings, falling back to the defaults. */
export function seasonRanges(
  seasons: Partial<Record<DatedSeason, SeasonRange | null>> | null | undefined,
): SeasonRanges {
  return Object.fromEntries(
    DATED.map((season) => [season, seasons?.[season] ?? DEFAULT_SEASONS[season]]),
  ) as SeasonRanges
}
