/**
 * When the opening intro (Effect 2) plays. The two decisions are self-contained functions: they
 * are unit tested here and inlined into the page as-is, where they run before anything paints.
 */

/** Bump to show a new intro to everyone, even if they saw the old one recently. */
export const INTRO_VERSION = 1
/** The intro greets the same browser at most once in this many days. */
export const INTRO_REPEAT_DAYS = 30
/** Snow is cleared, the logo lands, the screen bursts open: all over by this point (CSS). */
export const INTRO_LENGTH_MS = 1800

/** Whether this browser saw the current intro (or started a visit elsewhere) in the last N days. */
export function introSeen(record: unknown, now: number, version: number, days: number): boolean {
  if (typeof record !== 'object' || record === null) return false
  const entry = record as { v?: unknown; at?: unknown }
  return (
    entry.v === version &&
    typeof entry.at === 'number' &&
    now - entry.at >= 0 &&
    now - entry.at < days * 86400000
  )
}

/**
 * Plays only when a visit starts on the home page with a full page load. Visitors from a search
 * engine, an ad or a tagged link came for the page itself, so they go straight to it (Google's
 * guidance on interstitials). `?intro=on` plays it anyway, for demos and tests.
 */
export function introWanted(page: {
  path: string
  search: string
  referrer: string
  seen: boolean
}): boolean {
  if (/[?&]intro=on(&|$)/.test(page.search)) return true
  if (page.seen || page.path !== '/') return false
  if (/[?&](gclid|gbraid|wbraid|msclkid|fbclid|utm_[a-z]+)=/i.test(page.search)) return false
  return !/^(https?:\/\/([^/?#]+\.)?(google|bing|yahoo|duckduckgo|ecosia|baidu|yandex|startpage|qwant)\.|android-app:\/\/com\.google)/i.test(
    page.referrer,
  )
}

/**
 * Runs in the page before the overlay is parsed. Reduced motion or blocked storage: no intro.
 * Otherwise it remembers the visit and shows the overlay frozen on its first frame
 * (data-intro="wait"). The animation starts only once the browser reports its first paint (or
 * after about a second of frames, whichever comes first), so a slow computer still busy loading
 * the page sees the whole intro instead of its end, and a page opened in a background tab waits
 * until it's looked at. Any key, focus,
 * click, wheel, swipe or scroll ends it. A click ends it rather than a press, so the tap that
 * skips it can never land on a link underneath.
 */
export const INTRO_SCRIPT = `(function(){
var d=document,h=d.documentElement,key='wc-intro';
try{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var raw=localStorage.getItem(key),record=null;
try{record=JSON.parse(raw||'null')}catch(e){}
var seen=(${introSeen.toString()})(record,Date.now(),${INTRO_VERSION},${INTRO_REPEAT_DAYS});
var show=(${introWanted.toString()})({path:location.pathname,search:location.search,referrer:d.referrer,seen:seen});
var begin=function(){if(!seen)try{localStorage.setItem(key,JSON.stringify({v:${INTRO_VERSION},at:Date.now()}))}catch(e){}if(show)play()};
if(d.prerendering){if(show)h.setAttribute('data-intro','wait');d.addEventListener('prerenderingchange',begin,{once:true})}else begin();
}catch(e){}
function play(){
var events=['keydown','focusin','click','wheel','touchmove','scroll'],timer=0;
function end(now){clearTimeout(timer);events.forEach(function(t){removeEventListener(t,skip,true)});h.setAttribute('data-intro',now?'done':'leaving');if(!now)setTimeout(function(){h.setAttribute('data-intro','done')},350)}
function skip(e){end(e.type==='keydown'||e.type==='focusin')}
var frames=0;
function painted(){try{return performance.getEntriesByType('paint').length>0}catch(e){return true}}
function run(){if(h.getAttribute('data-intro')!=='wait')return;if(!painted()&&frames++<60){requestAnimationFrame(run);return}h.setAttribute('data-intro','play');timer=setTimeout(function(){end(true)},${INTRO_LENGTH_MS + 100})}
h.setAttribute('data-intro','wait');
events.forEach(function(t){addEventListener(t,skip,{capture:true,passive:true})});
requestAnimationFrame(function(){requestAnimationFrame(run)});
}
})()`
