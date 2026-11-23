/**
 * When the opening intro (Effect 2) plays: every time the home page is opened (owner,
 * 2026-11-23). The decision is a self-contained function: it is unit tested here and inlined into
 * the page as-is, where it runs before anything paints.
 */

/** The hammer hits, the ice cracks and blasts apart: all over by this point (CSS). */
export const INTRO_LENGTH_MS = 1600

/**
 * Plays whenever the home page is opened with a full page load: typed in, from a bookmark, in a
 * new tab or reloaded. Moving between pages inside the site never replays it (no full load).
 * Visitors from a search engine, an ad or a tagged link came for the page itself, so they go
 * straight to it (Google's guidance on interstitials). `?intro=on` plays it on any page.
 */
export function introWanted(page: { path: string; search: string; referrer: string }): boolean {
  if (/[?&]intro=on(&|$)/.test(page.search)) return true
  if (page.path !== '/') return false
  if (/[?&](gclid|gbraid|wbraid|msclkid|fbclid|utm_[a-z]+)=/i.test(page.search)) return false
  return !/^(https?:\/\/([^/?#]+\.)?(google|bing|yahoo|duckduckgo|ecosia|baidu|yandex|startpage|qwant)\.|android-app:\/\/com\.google)/i.test(
    page.referrer,
  )
}

/**
 * Runs in the page before the overlay is parsed. Reduced motion: no intro. Otherwise it shows the
 * overlay frozen on its first frame (data-intro="wait"). The animation starts only once the
 * browser reports its first paint (or after about a second of frames), so a slow computer still
 * busy loading the page sees the whole intro instead of its end, and a page opened in a
 * background tab waits until it's looked at. Any key, focus, click, wheel, swipe or scroll ends
 * it. A click ends it rather than a press, so the tap that skips it can never land on a link
 * underneath.
 */
export const INTRO_SCRIPT = `(function(){
var d=document,h=d.documentElement;
try{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(!(${introWanted.toString()})({path:location.pathname,search:location.search,referrer:d.referrer}))return;
if(d.prerendering){h.setAttribute('data-intro','wait');d.addEventListener('prerenderingchange',play,{once:true})}else play();
}catch(e){}
function play(){
var events=['keydown','focusin','click','wheel','touchmove','scroll'],timer=0,frames=0;
function end(now){clearTimeout(timer);events.forEach(function(t){removeEventListener(t,skip,true)});h.setAttribute('data-intro',now?'done':'leaving');if(!now)setTimeout(function(){h.setAttribute('data-intro','done')},350)}
function skip(e){end(e.type==='keydown'||e.type==='focusin')}
function painted(){try{return performance.getEntriesByType('paint').length>0}catch(e){return true}}
function run(){if(h.getAttribute('data-intro')!=='wait')return;if(!painted()&&frames++<60){requestAnimationFrame(run);return}h.setAttribute('data-intro','play');timer=setTimeout(function(){end(true)},${INTRO_LENGTH_MS + 100})}
h.setAttribute('data-intro','wait');
events.forEach(function(t){addEventListener(t,skip,{capture:true,passive:true})});
requestAnimationFrame(function(){requestAnimationFrame(run)});
}
})()`
