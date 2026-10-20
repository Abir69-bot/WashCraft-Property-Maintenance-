import type { CategorySeed } from '../types'

export const categories: CategorySeed[] = [
  {
    slug: 'exterior-cleaning',
    title: 'Exterior Cleaning',
    menuLabel: 'Exterior cleaning',
    tone: 'exterior',
    icon: 'droplets',
    headline: 'Exterior cleaning that makes the whole property shine',
    intro:
      'Siding, roofs, gutters, windows, driveways and decks all collect grime in their own way. We clean each one with the right method: gentle soft washing for siding and roofs, and pressure washing for concrete and stone. Book one service or bundle a few and get the whole outside done in one visit.',
    summary:
      'House washing, roof and gutter cleaning, windows, driveways, decks and more, each with the right method for the surface.',
    outcomeLabel: 'Get a cleaner exterior',
    heroImageLabel:
      'Two-story home with freshly washed siding, clean windows and a bright driveway',
    bookingNote:
      'Spring and early fall fill up fast. Book 2–3 weeks ahead for your preferred date.',
    bundles: [
      {
        title: 'Curb appeal bundle',
        description:
          'House wash, window cleaning and driveway cleaning in one visit. The fastest way to make a home look cared for.',
        services: ['house-washing', 'window-cleaning', 'driveway-cleaning'],
      },
      {
        title: 'Roof-to-gutter bundle',
        description:
          'Roof cleaning, gutter cleaning and gutter brightening together, so water flows freely and the roofline looks new.',
        services: ['roof-cleaning', 'gutter-cleaning', 'gutter-brightening'],
      },
    ],
  },
  {
    slug: 'interior-cleaning',
    title: 'Interior Cleaning',
    menuLabel: 'Interior cleaning',
    tone: 'interior',
    icon: 'sparkles',
    headline: 'Interior cleaning and hauling, done properly',
    intro:
      'From weekly house cleaning to the deep clean before you hand over the keys, we bring the same checklist and care inside as we do outside. We also clean out garages, haul away junk and handle the small maintenance jobs that never seem to get done.',
    summary:
      'House cleaning, move-in and move-out cleaning, post-construction cleanup, garages, junk removal and general maintenance.',
    outcomeLabel: 'Get a spotless home',
    heroImageLabel: 'Bright, freshly cleaned kitchen with clear counters',
    bundles: [
      {
        title: 'Moving day bundle',
        description:
          'Move-out cleaning, garage cleaning and junk removal, so you leave the old place empty and spotless.',
        services: ['move-in-move-out-cleaning', 'garage-cleaning', 'junk-removal'],
      },
    ],
  },
  {
    slug: 'winter-services',
    title: 'Winter Services',
    menuLabel: 'Snow & ice',
    tone: 'winter',
    icon: 'snowflake',
    headline: 'Snow and ice handled before you need to leave',
    intro:
      'A seasonal snow contract puts your property on our route for the whole winter. We clear driveways, walkways and sidewalks after each qualifying snowfall, add salting or ice control if you want it, and haul away snowbanks when they pile up. Routes fill up, so sign up before the first storm.',
    summary:
      'Seasonal snow contracts for driveways and walkways, plus salting, ice control and snowbank removal.',
    outcomeLabel: 'Get on a snow route',
    heroImageLabel: 'Crew member clearing a residential driveway at dawn after a snowfall',
    bookingNote:
      'Snow routes are planned in the fall. Sign up by early November for full-season service.',
    bundles: [
      {
        title: 'Worry-free winter bundle',
        description:
          'Driveway and walkway clearing plus salting after every visit. Nothing to shovel, nothing to salt.',
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
    headline: 'Holiday lights, hung for you and taken down in January',
    intro:
      'Skip the ladder this year. We design, install and maintain your holiday lights, then take them down in January and store them until next season if you like. Use your own lights or let us supply commercial-grade ones.',
    summary: 'Christmas light installation, January removal and off-season storage.',
    outcomeLabel: 'Book your lights',
    heroImageLabel: 'Home at dusk with warm white roofline lights and lit shrubs',
    bookingNote:
      'Install dates book up by mid-November. Reserve early for a pre-Thanksgiving install.',
    bundles: [
      {
        title: 'Full-season lighting',
        description:
          'Installation, a mid-season check, January removal and storage until next year.',
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
    headline: 'Yard cleanups and exterior upkeep through the seasons',
    intro:
      'Spring and fall cleanups, leaf removal, garden beds, garbage bin cleaning and the small exterior jobs that keep a home in good shape: caulking, minor repairs, staining and painting. Plan them once and let us keep the outside of your home on schedule.',
    summary:
      'Seasonal yard cleanups, leaf removal, bin cleaning, staining, painting, caulking and minor repairs.',
    outcomeLabel: 'Get a tidy yard',
    heroImageLabel: 'Neat front yard with edged beds and a freshly stained fence',
    bookingNote:
      'Fall cleanups book up in October. Spring cleanups start as soon as the snow melts.',
    bundles: [
      {
        title: 'Fence refresh bundle',
        description:
          'Fence cleaning followed by staining. Cleaning first helps the stain soak in and last longer.',
        services: ['fence-cleaning', 'fence-deck-staining', 'yard-cleanup'],
      },
    ],
  },
  {
    slug: 'commercial',
    title: 'Commercial & HOA',
    menuLabel: 'Commercial & HOA',
    tone: 'commercial',
    icon: 'building',
    headline: 'Property maintenance for HOAs, property managers and businesses',
    intro:
      'One contact for building washing, windows, gutters, parking garages, snow and holiday lighting across one property or many. We work to your schedule, keep residents and customers informed, and provide the paperwork your board or insurer asks for.',
    summary:
      'Building washing, windows, gutters, roofs, parking garages, graffiti removal, solar panels and permanent lighting for HOAs and businesses.',
    outcomeLabel: 'Request a commercial bid',
    heroImageLabel: 'Crew on a lift washing a three-story condo building',
    bundles: [
      {
        title: 'Year-round HOA contract',
        description:
          'Building washing and gutters in spring and fall, windows twice a year and snow clearing all winter, under one contract.',
        services: [
          'hoa-building-washing',
          'commercial-gutter-cleaning',
          'commercial-snow-clearing',
        ],
      },
    ],
  },
]
