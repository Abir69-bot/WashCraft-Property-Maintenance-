import type { CitySeed } from '../types'

/**
 * Demo service areas (Denver Metro). Geography is general and well known; ZIP lists and
 * neighborhoods are listed in CONTENT_TODO.md for the owner to verify. No local statistics are
 * included: those need a cited source (brief §9.4).
 */
export const cities: CitySeed[] = [
  {
    name: 'Denver',
    state: 'CO',
    lat: 39.7392,
    lng: -104.9903,
    zipPrefixes: ['802'],
    heroImageLabel: 'Brick Denver Square home on a tree-lined street in fall',
    intro:
      'Denver homes come in every age and style, from brick bungalows and classic Denver Squares in the older neighborhoods to new townhomes going up across the city. That variety matters when it comes to cleaning and upkeep. Old brick and painted trim need a gentle soft wash, while newer fiber cement and vinyl siding have their own needs. Mature street trees in many neighborhoods drop leaves and seeds that fill gutters twice a year, and those same trees shade roofs where algae and moss like to grow. Winter brings snow that can arrive early in the fall or late in the spring, and quick melt-and-freeze cycles that turn walkways icy overnight. Summer storms can bring hail and wind that leave debris on roofs and in yards. We plan Denver jobs around all of that: soft washing older homes with care, scheduling gutter cleaning after the leaves drop, and keeping snow routes moving across the city all winter.',
    neighborhoods: [
      {
        name: 'Washington Park',
        blurb:
          'Classic brick homes and big old trees near the park, where gutters fill fast in fall and shady roofs need regular care.',
        imageLabel: 'Brick home near Washington Park with mature trees',
      },
      {
        name: 'Highland',
        blurb:
          'A mix of Victorian homes and modern infill. Older paint and trim get a gentle soft wash, newer builds get windows and gutters.',
        imageLabel: 'Row of Highland homes, old and new side by side',
      },
      {
        name: 'Park Hill',
        blurb:
          'Tudor and brick homes with large lots, mature landscaping and long front walks that need clearing after every snow.',
        imageLabel: 'Park Hill Tudor home with a long front walkway',
      },
      {
        name: 'Central Park',
        blurb:
          'Newer homes and townhomes where window cleaning, house washing and bin cleaning keep things looking new.',
        imageLabel: 'Newer townhomes in Central Park with clean siding',
      },
    ],
    whyChooseUs:
      'Denver’s older homes need a careful hand. We soft wash brick and painted trim, never blast it, and we plan winter routes so central neighborhoods are cleared in order.',
    faqs: [
      {
        question: 'Do you serve all of Denver?',
        answer: 'Yes, across the city. Use the ZIP code checker to confirm your address.',
      },
      {
        question: 'Can you clean older brick homes safely?',
        answer: 'Yes. Old brick and mortar get low-pressure soft washing, never high pressure.',
      },
      {
        question: 'Do you clear public sidewalks in Denver?',
        answer: 'Yes. Add the sidewalk along your property to a snow contract.',
      },
    ],
  },
  {
    name: 'Aurora',
    state: 'CO',
    lat: 39.7294,
    lng: -104.8319,
    zipPrefixes: [
      '80010',
      '80011',
      '80012',
      '80013',
      '80014',
      '80015',
      '80016',
      '80017',
      '80018',
      '80019',
      '80045',
      '80046',
      '80047',
    ],
    heroImageLabel: 'Two-story stucco home in an Aurora subdivision with a wide driveway',
    intro:
      'Aurora stretches east from Denver onto the open plains, and its homes range from established mid-century neighborhoods to large newer subdivisions. Many newer homes have stucco or fiber cement siding, wide two- and three-car driveways and HOA rules about how the outside should look. Out on the eastern side of the city there are fewer trees to block the wind, so dust and grit settle on siding and windows, and snow drifts across driveways after a storm. Wide driveways and long sidewalks mean a lot of snow to move, which is why many Aurora homeowners choose a seasonal snow contract. In the older neighborhoods, mature trees bring the usual fall gutter work. We tailor Aurora jobs to both: soft washing stucco gently so it doesn’t crack, keeping HOA-managed homes looking consistent, and planning snow routes for big driveways and long frontages.',
    neighborhoods: [
      {
        name: 'Saddle Rock',
        blurb:
          'Larger homes with stucco and stone where soft washing and window cleaning keep the exterior sharp.',
        imageLabel: 'Stucco and stone home in Saddle Rock',
      },
      {
        name: 'Tallyn’s Reach',
        blurb:
          'Newer homes with wide driveways that need clearing fast after snow, plus regular house washing.',
        imageLabel: 'Wide driveway in Tallyn’s Reach after snow clearing',
      },
      {
        name: 'Murphy Creek',
        blurb:
          'Open-sky homes on the east side where wind brings dust to siding and drifts to driveways.',
        imageLabel: 'Home in Murphy Creek with open views',
      },
      {
        name: 'Hoffman Heights',
        blurb:
          'Established ranch homes with mature trees, where gutter cleaning and fall cleanups matter most.',
        imageLabel: 'Ranch home in Hoffman Heights with mature trees',
      },
    ],
    whyChooseUs:
      'Many Aurora homes are part of HOAs with exterior standards. We clean to a consistent look, soft wash stucco safely and size snow routes for wide driveways.',
    faqs: [
      {
        question: 'Can you work within my HOA’s rules?',
        answer:
          'Yes. Tell us any HOA requirements, like approved times or products, and we’ll follow them.',
      },
      {
        question: 'Is stucco safe to wash?',
        answer: 'Yes, with a soft wash. High pressure can crack stucco, so we never use it.',
      },
      {
        question: 'Do you clear three-car driveways?',
        answer: 'Yes. Choose your driveway size when you sign up for a snow contract.',
      },
    ],
  },
  {
    name: 'Lakewood',
    state: 'CO',
    lat: 39.7047,
    lng: -105.0814,
    zipPrefixes: ['80214', '80215', '80226', '80227', '80228', '80232', '80235'],
    heroImageLabel: 'Lakewood ranch home with the foothills in the background',
    intro:
      'Lakewood sits right against the foothills on Denver’s west side, and many homes have views of Green Mountain and the Front Range. That location brings its own upkeep. Homes closer to the foothills often have more trees and shade, which means moss and algae on north-facing roofs and siding, and gutters that fill with needles and leaves. Storms can come off the mountains quickly, bringing heavy snow in winter and hail in late spring and summer. Lakewood has many mid-century ranch homes with long rooflines and wide eaves, alongside newer homes and townhomes near Belmar. Long rooflines mean a lot of gutter to keep clear and a great canvas for holiday lights. We work across Lakewood with that in mind, scheduling gutter cleaning after needle and leaf drop, treating shady roofs gently, and keeping snow routes ready for storms that roll in off the foothills.',
    neighborhoods: [
      {
        name: 'Belmar',
        blurb:
          'Townhomes and condos around Lakewood’s downtown, where balconies, windows and garages need regular care.',
        imageLabel: 'Townhomes near Belmar with clean windows',
      },
      {
        name: 'Green Mountain',
        blurb:
          'Foothill homes with trees, shade and views, where roofs and gutters need the most attention.',
        imageLabel: 'Home on Green Mountain with trees and a foothills view',
      },
      {
        name: 'Bear Creek',
        blurb:
          'Homes near the creek and park trails, with lots of trees and fall leaves to manage.',
        imageLabel: 'Leaf-covered yard near Bear Creek in fall',
      },
    ],
    whyChooseUs:
      'Lakewood’s foothill homes get more shade and storms. We treat shady roofs gently, time gutter cleaning to the leaf drop and keep snow routes ready for mountain storms.',
    faqs: [
      {
        question: 'Can you remove moss from a shady roof?',
        answer: 'Yes, with a soft-wash roof treatment that’s safe for shingles.',
      },
      {
        question: 'Do you clean gutters full of pine needles?',
        answer: 'Yes. Needles can clog downspouts, so we flush every downspout too.',
      },
      {
        question: 'Do you install holiday lights on ranch homes?',
        answer:
          'Yes. Long rooflines make for great displays. Measure the front roofline for a quick price.',
      },
    ],
  },
  {
    name: 'Arvada',
    state: 'CO',
    lat: 39.8028,
    lng: -105.0875,
    zipPrefixes: ['80001', '80002', '80003', '80004', '80005', '80006', '80007'],
    heroImageLabel: 'Historic storefronts and homes near Olde Town Arvada',
    intro:
      'Arvada mixes historic character with new growth. Around Olde Town you’ll find older homes and brick storefronts, while the northwest side has large newer communities stretching toward the foothills. Older homes often have wood siding and trim that need careful washing and regular caulking and paint, while newer homes have larger windows and bigger roofs to keep clean. Many Arvada neighborhoods back onto open space and trails, which brings beautiful views and also blowing dust, pollen and leaves. Winter storms can drop heavy snow on the western neighborhoods closer to the hills. We plan Arvada work across that range. Soft washing and caulking protect older wood homes, window cleaning shows off the views in newer homes, and snow routes reach from Olde Town out to the newer communities on the northwest side.',
    neighborhoods: [
      {
        name: 'Olde Town Arvada',
        blurb:
          'Historic homes and storefronts where wood siding, trim and brick need a gentle, careful clean.',
        imageLabel: 'Older wood-sided home near Olde Town Arvada',
      },
      {
        name: 'Candelas',
        blurb:
          'Newer homes near the foothills with big windows and roofs, plus snow to clear in winter.',
        imageLabel: 'New home in Candelas with large windows',
      },
      {
        name: 'Ralston Valley',
        blurb:
          'Family neighborhoods with established trees, fences and decks that need seasonal care.',
        imageLabel: 'Backyard deck and fence in Ralston Valley',
      },
      {
        name: 'Leyden Rock',
        blurb: 'Newer homes near open space where pollen and dust settle on siding and windows.',
        imageLabel: 'Home in Leyden Rock backing onto open space',
      },
    ],
    whyChooseUs:
      'Arvada spans historic and brand-new homes. We protect older wood siding with gentle washing and caulking, and keep newer homes’ windows and roofs looking their best.',
    faqs: [
      {
        question: 'Do you work on historic homes?',
        answer:
          'Yes. Older wood and brick get low-pressure cleaning, and we check paint before washing.',
      },
      {
        question: 'Can you stain my fence and deck?',
        answer: 'Yes. We clean first, let the wood dry, then stain in summer.',
      },
      {
        question: 'Do you serve the northwest side?',
        answer:
          'Yes, including the newer communities toward the foothills. Check your ZIP code to confirm.',
      },
    ],
  },
  {
    name: 'Littleton',
    state: 'CO',
    lat: 39.6133,
    lng: -105.0166,
    zipPrefixes: ['80120', '80121', '80122', '80123', '80125', '80127', '80128'],
    heroImageLabel: 'Historic Main Street in Littleton with brick storefronts',
    intro:
      'Littleton combines a historic Main Street with family neighborhoods spreading south and west toward the foothills. The South Platte River and its trails run through the area, and many neighborhoods have mature trees, big backyards, wood fences and decks. That makes yard and exterior care a big part of keeping a Littleton home in shape. Fences and decks weather in the strong sun and need cleaning and staining every few years. Gutters fill with leaves in fall, and shady spots grow algae on siding and roofs. Neighborhoods on the southwest side, closer to the hills, often see more snow, while long driveways and sloped lots make clearing harder. We bring the full range of services to Littleton, from fence and deck staining in summer to fall leaf cleanups and winter snow routes.',
    neighborhoods: [
      {
        name: 'Downtown Littleton',
        blurb:
          'Historic homes near Main Street where older siding and trim need careful, low-pressure cleaning.',
        imageLabel: 'Historic home near downtown Littleton',
      },
      {
        name: 'Ken Caryl',
        blurb:
          'Homes near the foothills with decks, fences and sloped driveways that need seasonal care and snow clearing.',
        imageLabel: 'Ken Caryl home with a deck and foothills behind',
      },
      {
        name: 'Roxborough Park',
        blurb:
          'Homes among red rock and trees, where needles, leaves and snow keep gutters and drives busy.',
        imageLabel: 'Home among trees and red rocks near Roxborough',
      },
    ],
    whyChooseUs:
      'Littleton homes often have big yards, fences and decks. We pair cleaning and staining, handle fall leaf cleanups and plan snow routes for sloped drives.',
    faqs: [
      {
        question: 'Can you clean and stain my deck in one booking?',
        answer: 'Yes. We clean first, let it dry for at least 48 hours, then come back to stain.',
      },
      {
        question: 'Do you clear sloped driveways?',
        answer: 'Yes. Let us know about slopes when you sign up so we bring the right equipment.',
      },
      {
        question: 'Do you serve areas with Littleton addresses outside city limits?',
        answer: 'Usually, yes. Check your ZIP code or ask us.',
      },
    ],
  },
  {
    name: 'Centennial',
    state: 'CO',
    lat: 39.5807,
    lng: -104.8772,
    zipPrefixes: ['80111', '80112', '80121', '80122', '80015', '80016'],
    heroImageLabel: 'Centennial two-story home with a manicured front yard',
    intro:
      'Centennial is a young city made up of established suburban neighborhoods, many built in the 1970s through the 1990s, with mature trees, two-story homes and well-kept yards. Many neighborhoods have HOAs that expect exteriors to look tidy, so house washing, window cleaning and gutter care are regular parts of the calendar. Two-story homes mean high windows and gutters that are hard to reach safely without the right equipment. Tall trees drop leaves and seeds that fill gutters in spring and fall, and winter brings snow to long driveways and corner-lot sidewalks. Wood fences and decks are common and weather in the sun. We plan Centennial work around the seasons: house and window washing in spring, staining in summer, gutters and leaves in fall, and snow routes all winter.',
    neighborhoods: [
      {
        name: 'Willow Creek',
        blurb:
          'Established two-story homes with mature trees, where gutters and high windows need regular care.',
        imageLabel: 'Two-story home in Willow Creek with tall trees',
      },
      {
        name: 'Southglenn',
        blurb:
          'Homes near the Southglenn shops where curb appeal and HOA standards keep exteriors on a schedule.',
        imageLabel: 'Tidy front yard and siding in Southglenn',
      },
      {
        name: 'Piney Creek',
        blurb:
          'Larger homes on the east side with big roofs and long driveways to keep clean and clear.',
        imageLabel: 'Home with a long driveway in Piney Creek',
      },
      {
        name: 'Cherry Knolls',
        blurb:
          'Mid-century homes with mature landscaping, fences and decks that need seasonal care.',
        imageLabel: 'Cherry Knolls home with mature landscaping',
      },
    ],
    whyChooseUs:
      'Centennial’s two-story homes and HOA standards call for a regular schedule. We reach high windows and gutters safely and keep exteriors consistent season to season.',
    faqs: [
      {
        question: 'Can you reach second-story windows?',
        answer: 'Yes. We use water-fed poles and ladders with stand-offs for high windows.',
      },
      {
        question: 'Do you offer a yearly maintenance plan?',
        answer: 'Yes. See our maintenance plans for a set schedule through the year.',
      },
      {
        question: 'Can you work around HOA rules?',
        answer: 'Yes. Share your HOA’s requirements and we’ll follow them.',
      },
    ],
  },
]
