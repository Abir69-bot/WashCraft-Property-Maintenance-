/**
 * What the winter effects share (owner, 2026-11-23). The season itself comes from the site's
 * Seasonal settings: the layout passes `winter`, so the effects switch with the daily rebuild,
 * like the seasonal hero.
 */

/**
 * `?snow=on` or `?snow=off` in the address forces the falling snow and the snow cap on or off, so
 * they can be checked at any time of year. Self-contained: it is also inlined into the page.
 */
export function snowOverride(search: string): boolean | null {
  const value = new URLSearchParams(search).get('snow')
  return value === 'on' ? true : value === 'off' ? false : null
}

/**
 * The same check, run before the page paints by the server-rendered effects (intro and snow cap):
 * it marks <html data-snow="on|off"> so their CSS can follow it.
 */
export const SNOW_OVERRIDE_SCRIPT = `(function(){try{var on=(${snowOverride.toString()})(location.search);if(on!==null)document.documentElement.setAttribute('data-snow',on?'on':'off')}catch(e){}})()`
