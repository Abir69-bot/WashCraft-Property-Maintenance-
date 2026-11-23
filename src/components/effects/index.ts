/**
 * Seasonal effects layered on top of the site (owner, 2026-11-23). Each one is a single line in
 * src/app/(site)/layout.tsx: delete that line to remove the effect (and the import line once none
 * are left). Nothing else in the site depends on them.
 */
export { FallingSnow } from './falling-snow'
export { HeroParallax } from './hero-parallax'
export { IntroAnimation as Intro } from './intro-animation'
export { SnowCap } from './snow-cap'
