import type { CategorySeed } from '../types'

/**
 * Service groups, in menu order (2026-10 update): residential, commercial and restaurant, and
 * post-construction cleaning first, then exterior and seasonal maintenance. A category only shows
 * once it has a published service; with exactly one, its link goes straight to that service.
 * Copy makes no claims about availability, timing or prices.
 */
export const categories: CategorySeed[] = [
  {
    slug: 'interior-cleaning',
    title: 'Residential Cleaning',
    menuLabel: 'Residential cleaning',
    tone: 'interior',
    icon: 'sparkles',
    headline: 'Interior cleaning for homes and rentals',
    intro:
      'Kitchens, bathrooms, floors and living spaces cleaned to a checklist agreed with you up front. For homeowners, tenants and landlords getting a home ready between tenants.',
    summary: 'Interior house cleaning for kitchens, bathrooms, floors and living spaces.',
    outcomeLabel: 'Get a cleaner home',
    heroImageLabel: 'Bright, freshly cleaned kitchen with clear counters',
    bundles: [
      {
        title: 'Moving day bundle',
        description:
          'Move-out cleaning, garage cleaning and junk removal, so you leave the old place empty and clean.',
        services: ['move-in-move-out-cleaning', 'garage-cleaning', 'junk-removal'],
      },
    ],
  },
  {
    slug: 'commercial',
    title: 'Commercial & Restaurant Cleaning',
    menuLabel: 'Commercial & restaurant',
    tone: 'commercial',
    icon: 'building',
    headline: 'Cleaning for offices, shops and restaurants',
    intro:
      'Commercial and restaurant cleaning with the areas, tasks and visit times set out in a written estimate. For offices, retail spaces, common areas, dining rooms and front-of-house spaces.',
    summary: 'Commercial cleaning for offices and shops, and restaurant front-of-house cleaning.',
    outcomeLabel: 'Get a commercial quote',
    heroImageLabel: 'Clean office reception and a restaurant dining room before opening',
    bundles: [],
  },
  {
    slug: 'post-construction',
    title: 'Post-Construction Cleaning',
    menuLabel: 'Post-construction',
    tone: 'interior',
    icon: 'construction',
    headline: 'Cleanup after renovations and new builds',
    intro:
      'Construction dust, debris and residue cleared from surfaces, fixtures and floors so a renovated or newly built space is ready to use.',
    summary: 'Cleanup after renovations and new builds, for homes and businesses.',
    outcomeLabel: 'Get a post-construction clean',
    heroImageLabel: 'Newly renovated room, dust-free and ready to use',
    bundles: [],
  },
  {
    slug: 'exterior-cleaning',
    title: 'Exterior Cleaning',
    menuLabel: 'Exterior cleaning',
    tone: 'exterior',
    icon: 'droplets',
    headline: 'Exterior cleaning, matched to each surface',
    intro:
      'Siding, windows, gutters, roofs, driveways, patios and balconies all collect grime in their own way. Each one gets a method that suits the surface, and every job is scoped in writing before it’s booked.',
    summary:
      'Pressure and soft washing, windows, gutters, roofs, driveway sealing, patios and balconies.',
    outcomeLabel: 'Get a cleaner exterior',
    heroImageLabel:
      'Two-story home with freshly washed siding, clean windows and a bright driveway',
    bundles: [
      {
        title: 'Exterior refresh',
        description:
          'Soft washing for the siding, window cleaning and pressure washing for the walkways, quoted together.',
        services: ['soft-washing', 'window-cleaning', 'pressure-washing'],
      },
      {
        title: 'Roofline care',
        description:
          'Roof cleaning and gutter cleaning together, so the roof and gutters are clear.',
        services: ['roof-cleaning', 'gutter-cleaning'],
      },
    ],
  },
  {
    slug: 'winter-services',
    title: 'Snow Removal',
    menuLabel: 'Snow removal',
    tone: 'winter',
    icon: 'snowflake',
    headline: 'Snow removal for homes and businesses',
    intro:
      'Driveways, walkways and entrances cleared in winter. The areas, timing and options for your property are set out in your written estimate before the season starts.',
    summary: 'Snow removal for driveways, walkways and entrances.',
    outcomeLabel: 'Ask about snow removal',
    heroImageLabel: 'Residential driveway cleared after a snowfall',
    bundles: [
      {
        title: 'Winter bundle',
        description: 'Driveway and walkway clearing with salting, so there’s nothing to shovel.',
        services: ['driveway-snow-clearing', 'walkway-sidewalk-snow-clearing', 'salting-de-icing'],
      },
    ],
  },
  {
    slug: 'holiday-lighting',
    title: 'Holiday Lighting',
    menuLabel: 'Holiday lights',
    tone: 'holiday',
    icon: 'gift',
    headline: 'Christmas lights, hung for you',
    intro:
      'Christmas light installation for homes and businesses. What’s included, such as supplying lights or taking them down, is confirmed in your written estimate.',
    summary: 'Christmas light installation for rooflines, trees and shrubs.',
    outcomeLabel: 'Ask about holiday lights',
    heroImageLabel: 'Home at dusk with warm white roofline lights',
    bundles: [
      {
        title: 'Full-season lighting',
        description: 'Installation, January removal and storage until next year.',
        services: [
          'christmas-light-installation',
          'christmas-light-removal',
          'christmas-light-storage',
        ],
      },
    ],
  },
  {
    slug: 'yard-care',
    title: 'Yard & Exterior Care',
    menuLabel: 'Yard care',
    tone: 'yard',
    icon: 'leaf',
    headline: 'Yard cleanups and exterior upkeep',
    intro:
      'Spring and fall cleanups, leaf removal, garden beds and small exterior jobs that keep a property in good shape.',
    summary:
      'Seasonal yard cleanups, leaf removal, staining, painting, caulking and small repairs.',
    outcomeLabel: 'Get a tidy yard',
    heroImageLabel: 'Neat front yard with edged beds and a freshly stained fence',
    bundles: [
      {
        title: 'Fence refresh bundle',
        description:
          'Fence cleaning followed by staining. Cleaning first helps the stain soak in and last longer.',
        services: ['fence-cleaning', 'fence-deck-staining', 'yard-cleanup'],
      },
    ],
  },
]
