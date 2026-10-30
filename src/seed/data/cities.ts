import type { CitySeed } from '../types'

/**
 * Service areas in the Greater Toronto Area (set 2026-10-27). Geography is general and well
 * known; postal code prefixes (FSAs) and neighborhoods are listed in CONTENT_TODO.md for the
 * owner to verify. No local statistics are included: those need a cited source (brief §9.4).
 */
export const cities: CitySeed[] = [
  {
    name: 'Scarborough',
    state: 'ON',
    lat: 43.7731,
    lng: -79.2578,
    zipPrefixes: [
      'M1B',
      'M1C',
      'M1E',
      'M1G',
      'M1H',
      'M1J',
      'M1K',
      'M1L',
      'M1M',
      'M1N',
      'M1P',
      'M1R',
      'M1S',
      'M1T',
      'M1V',
      'M1W',
      'M1X',
    ],
    heroImageLabel: 'Brick bungalow on a quiet Scarborough street with mature trees',
    intro:
      'Scarborough stretches from the Bluffs along Lake Ontario up to the Rouge Valley, and its homes are just as varied. Many streets are lined with brick bungalows, back-splits and side-splits built after the war, next to two-story homes from the 1970s and 1980s and newer houses in the north end. Townhouse complexes are common too, and each one has its own rules for exterior work. Deep ravines and big trees bring shade, leaves and seeds, so gutters fill quickly in the fall and north-facing walls and roofs grow green algae. Homes near the lake catch more wind and moisture. Patios and interlock walkways also need a clean each spring. Winter brings snow and freeze-thaw days that leave driveways and front steps icy by morning. We plan Scarborough jobs around all of this: gentle soft washing for older brick and siding, gutter cleaning after the leaves come down, and snow removal in winter.',
    neighborhoods: [
      {
        name: 'Agincourt',
        blurb:
          'Bungalows and two-story homes on wide lots, where gutters, windows and driveways keep things looking sharp year-round.',
        imageLabel: 'Two-story brick home in Agincourt with a wide driveway',
      },
      {
        name: 'Guildwood',
        blurb:
          'Leafy streets near the lake and the Bluffs, with big trees that fill gutters fast and shade roofs where algae grows.',
        imageLabel: 'Guildwood home under tall trees in the fall',
      },
      {
        name: 'Birch Cliff',
        blurb:
          'Older homes close to the lake, where wind and moisture make a spring wash and window cleaning worth booking.',
        imageLabel: 'Older Birch Cliff home with a front porch',
      },
      {
        name: 'Malvern',
        blurb:
          'Townhouses and semis next to the Rouge, where siding, windows and driveways need regular care.',
        imageLabel: 'Row of townhouses in Malvern after a fresh wash',
      },
    ],
    whyChooseUs:
      'Scarborough homes range from postwar bungalows to new builds. We match the method to each one, and we put the plan for every property in writing.',
    faqs: [
      {
        question: 'Do you serve all of Scarborough?',
        answer:
          'Yes, from the Bluffs up to Steeles. Use the postal code checker to confirm your address.',
      },
      {
        question: 'Do you work on homes that back onto a ravine?',
        answer:
          'Yes. We protect plants and slopes, and we plan gutter and roof work around the big trees most ravine lots have.',
      },
      {
        question: 'Can you clean townhouse complexes?',
        answer:
          'Yes. We can quote one unit, or the whole complex with the property manager or condo board.',
      },
    ],
  },
  {
    name: 'North York',
    state: 'ON',
    lat: 43.7615,
    lng: -79.4111,
    zipPrefixes: [
      'M2H',
      'M2J',
      'M2K',
      'M2L',
      'M2M',
      'M2N',
      'M2P',
      'M2R',
      'M3A',
      'M3B',
      'M3C',
      'M3H',
      'M3J',
      'M3K',
      'M3L',
      'M3M',
      'M3N',
      'M4A',
      'M5M',
      'M6A',
      'M6B',
      'M6L',
      'M9L',
      'M9M',
    ],
    heroImageLabel: 'Detached North York home with large windows and a landscaped front yard',
    intro:
      'North York runs from the Humber in the west to the Don Valley in the east, and from the 401 up to Steeles. It mixes many kinds of homes. Older bungalows sit beside large new houses with stone, stucco and big windows, mid-century homes line the curving streets of Don Mills, and townhouses and condo buildings cluster near Yonge Street. Each type needs a different approach. Stucco and stone need a gentle soft wash, large glass needs streak-free window cleaning, and new interlock driveways and patios stay sharp with a regular surface clean. Mature trees shade many streets, so gutters fill in the fall and moss can creep onto shaded roofs. Ravines bring wildlife and extra leaves. In winter, long driveways and front walks need clearing early, before people head to work. We plan North York jobs around all of it, from spring soft washing to fall gutter cleaning and winter snow removal.',
    neighborhoods: [
      {
        name: 'Willowdale',
        blurb:
          'A mix of older homes and new builds near Yonge, where big windows and stone fronts need the right cleaning method.',
        imageLabel: 'New stone-front home in Willowdale with large windows',
      },
      {
        name: 'Don Mills',
        blurb:
          'Mid-century homes on curving streets with mature trees, where gutters and shaded roofs need regular care.',
        imageLabel: 'Mid-century Don Mills home with a low roofline',
      },
      {
        name: 'Bayview Village',
        blurb:
          'Detached homes on generous lots, with long driveways that need clearing after every snowfall.',
        imageLabel: 'Bayview Village home with a long driveway in winter',
      },
      {
        name: 'York Mills',
        blurb:
          'Larger homes on treed lots near the ravines, where leaves, moss and big roofs keep crews busy every fall.',
        imageLabel: 'Large York Mills home surrounded by tall trees',
      },
    ],
    whyChooseUs:
      'North York has everything from bungalows to big new builds. We use the right method for stucco, stone and glass, and we clear long driveways early on snow days.',
    faqs: [
      {
        question: 'Do you serve all of North York?',
        answer:
          'Yes, from Downsview to Don Mills and up to Steeles. Use the postal code checker to confirm your address.',
      },
      {
        question: 'Can you clean new homes with stucco, stone and large windows?',
        answer:
          'Yes. Stucco and stone get a gentle soft wash, and large windows get streak-free cleaning with pure water.',
      },
      {
        question: 'When should I book gutter cleaning under big trees?',
        answer:
          'Late fall, after the leaves have dropped, and again in spring if your trees drop seeds.',
      },
    ],
  },
  {
    name: 'Etobicoke',
    state: 'ON',
    lat: 43.6542,
    lng: -79.5674,
    zipPrefixes: [
      'M8V',
      'M8W',
      'M8X',
      'M8Y',
      'M8Z',
      'M9A',
      'M9B',
      'M9C',
      'M9P',
      'M9R',
      'M9V',
      'M9W',
    ],
    heroImageLabel: 'Tudor-style home in Etobicoke with a stone walkway in the fall',
    intro:
      'Etobicoke sits between the Humber River and Etobicoke Creek, from the Lake Ontario shoreline up to Rexdale. Its homes span about a century. Brick, stone and stucco houses from the 1920s to the 1940s fill neighborhoods like the Kingsway, postwar bungalows and side-splits line much of central Etobicoke, and newer townhouses and condo buildings rise along the lake. Older homes need a careful hand, with low-pressure soft washing that protects old mortar, paint and wood trim. Tall, mature trees are everywhere, so gutters fill quickly in the fall and shaded roofs and decks turn green. Lakeside homes deal with more wind and moisture, which leaves windows and siding dirty sooner. Winter brings snow and icy mornings, and steep driveways near the valleys need clearing and salting. We plan Etobicoke jobs around all of it: gentle cleaning for older homes, gutters after the leaves fall, and snow removal in winter.',
    neighborhoods: [
      {
        name: 'The Kingsway',
        blurb:
          'Older brick and stone homes under tall trees, where gentle soft washing and hand-cleaned gutters matter most.',
        imageLabel: 'Brick and stone home in the Kingsway under tall trees',
      },
      {
        name: 'Mimico',
        blurb:
          'Older homes and new condos near the lake, where wind and moisture make window and soft washing worth keeping up with.',
        imageLabel: 'Mimico street with older homes near the lake',
      },
      {
        name: 'Long Branch',
        blurb:
          'Lakeside homes on leafy streets, with patios and driveways that benefit from a spring clean.',
        imageLabel: 'Long Branch home with a wooden fence and deck',
      },
      {
        name: 'Islington Village',
        blurb:
          'A mix of bungalows and two-story homes, where gutters, windows and snow clearing keep things running smoothly.',
        imageLabel: 'Two-story home in Islington Village in winter',
      },
    ],
    whyChooseUs:
      'Many Etobicoke homes are decades old. We soft wash old brick, stone and stucco instead of blasting it, and clean gutters by hand under the big trees.',
    faqs: [
      {
        question: 'Do you serve all of Etobicoke?',
        answer:
          'Yes, from the lakeshore up to Rexdale. Use the postal code checker to confirm your address.',
      },
      {
        question: 'Can you clean older brick and stone homes safely?',
        answer:
          'Yes. Older brick, stone and stucco get low-pressure soft washing that protects the mortar and finish.',
      },
      {
        question: 'Do you clear steep driveways?',
        answer:
          'Yes. Add your driveway to a snow contract and choose salting, so steep slopes are cleared and treated after each snowfall.',
      },
    ],
  },
  {
    name: 'Markham',
    state: 'ON',
    lat: 43.8561,
    lng: -79.337,
    zipPrefixes: ['L3P', 'L3R', 'L3S', 'L3T', 'L6B', 'L6C', 'L6E', 'L6G'],
    heroImageLabel: 'Two-story stone and brick home in a Markham subdivision',
    intro:
      'Markham has historic main streets in Unionville and Markham Village, planned neighborhoods like Cornell, and many subdivisions built since the 1980s. Most homes are two-story detached houses and townhouses with brick, stone, stucco and vinyl siding, often with interlock driveways and walkways. Each surface needs its own approach: a gentle soft wash for stucco and siding, a surface cleaner for interlock, and careful work on the wood and older brick of heritage homes. Young trees in newer areas drop fewer leaves, but seeds and spring blossoms still find their way into gutters, and the older parts of town have big mature trees. Patios and walkways darken without a yearly clean. Shared driveways and tight side yards in townhouse rows call for careful scheduling. Winter brings snow and icy mornings, and wide driveways need clearing before the morning rush. We plan Markham jobs around all of it, from spring washing to fall gutter cleaning and winter snow removal.',
    neighborhoods: [
      {
        name: 'Unionville',
        blurb:
          'Heritage homes near the historic main street and newer houses around them, where gentle cleaning protects older finishes.',
        imageLabel: 'Heritage home near Main Street Unionville',
      },
      {
        name: 'Markham Village',
        blurb:
          'Older homes on treed streets near Main Street Markham, with gutters and roofs that need regular fall care.',
        imageLabel: 'Older home on a treed street in Markham Village',
      },
      {
        name: 'Cornell',
        blurb:
          'Newer homes and townhouses with front porches and rear lanes, where soft washing and window cleaning keep things looking new.',
        imageLabel: 'Townhouses with front porches in Cornell',
      },
      {
        name: 'Berczy Village',
        blurb:
          'Two-story homes with interlock driveways, a good fit for pressure washing, window cleaning and snow removal.',
        imageLabel: 'Berczy Village home with an interlock driveway',
      },
    ],
    whyChooseUs:
      'Markham homes mix stucco, stone, siding and interlock. We use the right method for each surface, and we agree the details of every job in writing.',
    faqs: [
      {
        question: 'Do you serve all of Markham?',
        answer:
          'Yes, including Unionville, Markham Village, Cornell and Thornhill east of Yonge. Use the postal code checker to confirm your address.',
      },
      {
        question: 'Can you clean interlock driveways and walkways?',
        answer:
          'Yes. A surface cleaner lifts dirt and moss from interlock without blasting the sand out of the joints.',
      },
      {
        question: 'Do you work in townhouse complexes?',
        answer:
          'Yes. We can quote one unit, or the whole complex with the property manager or condo board.',
      },
    ],
  },
  {
    name: 'Vaughan',
    state: 'ON',
    lat: 43.8361,
    lng: -79.4983,
    zipPrefixes: ['L4H', 'L4J', 'L4K', 'L4L', 'L6A'],
    heroImageLabel: 'Large detached home in Vaughan with a stone front and interlock driveway',
    intro:
      'Vaughan includes Woodbridge, Maple, Concord, Thornhill west of Yonge and the village of Kleinburg, along with newer neighborhoods and the condo towers of the Vaughan Metropolitan Centre. Many homes are large detached houses with stone and stucco fronts, tall windows, big rooflines and wide interlock driveways. That size makes some jobs harder, like reaching high windows and second-story gutters or hanging holiday lights along a long roofline. Stone and stucco need a gentle soft wash so the finish stays intact, and interlock driveways and patios stay sharp with a regular surface clean. Newer streets have young trees, while older parts of Woodbridge and Thornhill have big mature ones that fill gutters every fall. Patios in big backyards benefit from a spring clean too. Winter brings snow and icy driveways, and long, wide driveways need clearing early. We plan Vaughan jobs around all of it, from spring washing to fall gutters, holiday lights and winter snow removal.',
    neighborhoods: [
      {
        name: 'Woodbridge',
        blurb:
          'Large homes with stone fronts and interlock driveways, a good fit for soft washing, pressure washing and snow removal.',
        imageLabel: 'Woodbridge home with a stone front and interlock driveway',
      },
      {
        name: 'Maple',
        blurb:
          'Newer subdivisions with two-story homes and townhouses, where window cleaning and soft washing keep them looking new.',
        imageLabel: 'Two-story homes on a street in Maple',
      },
      {
        name: 'Concord',
        blurb:
          'Homes, townhouses and businesses side by side, where we handle both residential work and commercial bids.',
        imageLabel: 'Townhouses and a small business plaza in Concord',
      },
      {
        name: 'Thornhill',
        blurb:
          'Established streets with mature trees west of Yonge, where gutters fill fast and shaded roofs need regular care.',
        imageLabel: 'Thornhill home under mature trees in the fall',
      },
    ],
    whyChooseUs:
      'Vaughan homes are often big, with tall windows and long rooflines. We confirm what we can safely reach, including rooflines for holiday lights, before we quote.',
    faqs: [
      {
        question: 'Do you serve all of Vaughan?',
        answer:
          'Yes, including Woodbridge, Maple, Concord, Thornhill and Kleinburg. Use the postal code checker to confirm your street, or just ask.',
      },
      {
        question: 'Can you reach high windows and second-story gutters?',
        answer:
          'Yes. We use water-fed poles for high glass and work safely on ladders for gutters and rooflines.',
      },
      {
        question: 'Do you install holiday lights on large homes?',
        answer: 'Yes. We measure the roofline and give you a price for the whole house.',
      },
    ],
  },
  {
    name: 'Richmond Hill',
    state: 'ON',
    lat: 43.8828,
    lng: -79.4403,
    zipPrefixes: ['L4B', 'L4C', 'L4E', 'L4S'],
    heroImageLabel: 'Richmond Hill home with a landscaped yard and a double garage',
    intro:
      'Richmond Hill runs along Yonge Street from Richvale up to Oak Ridges, where kettle lakes like Lake Wilcox sit on the Oak Ridges Moraine. Its homes range from older houses near the historic village core to large homes in Bayview Hill and newer subdivisions in Jefferson and Oak Ridges. You will find brick, stone, stucco and siding, interlock driveways, decks and plenty of glass. Each needs the right method: a gentle soft wash for stucco and siding, streak-free cleaning for big windows and skylights, and a surface clean for interlock and patios. Near the lakes, ponds and wooded areas, we keep runoff low and protect plants and lawns. Mature trees in the older parts of town fill gutters every fall, and newer areas see seeds and blossoms in spring. Winter brings snow and icy driveways that need clearing early. We plan Richmond Hill jobs around all of it, season by season.',
    neighborhoods: [
      {
        name: 'Oak Ridges',
        blurb:
          'Homes near Lake Wilcox and the moraine, where careful washing protects lawns, gardens and nearby water.',
        imageLabel: 'Oak Ridges home near Lake Wilcox',
      },
      {
        name: 'Mill Pond',
        blurb:
          'Established streets with mature trees near the pond, where gutters and shaded roofs need regular care.',
        imageLabel: 'Home on a treed street near Mill Pond',
      },
      {
        name: 'Bayview Hill',
        blurb:
          'Large homes with big windows and long driveways, a good fit for window cleaning, soft washing and snow removal.',
        imageLabel: 'Large Bayview Hill home with a long driveway',
      },
      {
        name: 'Jefferson',
        blurb:
          'Newer homes near the forest, where patios and windows benefit from a regular clean.',
        imageLabel: 'Jefferson home with a deck backing onto trees',
      },
    ],
    whyChooseUs:
      'Richmond Hill has lakes, ponds and woods close to many homes. We keep runoff low and protect gardens, and we clear long driveways early on snow days.',
    faqs: [
      {
        question: 'Do you serve all of Richmond Hill?',
        answer:
          'Yes, from Richvale up to Oak Ridges. Use the postal code checker to confirm your address.',
      },
      {
        question: 'Do you work near Lake Wilcox and other water?',
        answer:
          'Yes. Near lakes, ponds and wooded areas we keep runoff low and protect plants, lawns and gardens.',
      },
      {
        question: 'Can you clean large windows and skylights?',
        answer:
          'Yes. Large windows get streak-free cleaning with pure water, and skylights are cleaned safely from the roof or a ladder.',
      },
    ],
  },
  {
    name: 'Mississauga',
    state: 'ON',
    lat: 43.589,
    lng: -79.6441,
    zipPrefixes: [
      'L4T',
      'L4V',
      'L4W',
      'L4X',
      'L4Y',
      'L4Z',
      'L5A',
      'L5B',
      'L5C',
      'L5E',
      'L5G',
      'L5H',
      'L5J',
      'L5K',
      'L5L',
      'L5M',
      'L5N',
      'L5R',
      'L5S',
      'L5T',
      'L5V',
      'L5W',
    ],
    heroImageLabel: 'Two-story Mississauga home with a clean driveway and front garden',
    intro:
      'Mississauga stretches from the Lake Ontario shore in Port Credit and Lorne Park up to Meadowvale and Malton. Its homes cover several eras: postwar houses and large lots with mature trees in the south, subdivisions from the 1970s to the 1990s in areas like Erin Mills and Meadowvale, newer homes and townhouses across the city, and condo towers downtown. That means a wide mix of brick, siding, stucco, decks, fences and interlock driveways, each with its own cleaning needs. Homes near the lake and the Credit River see more moisture, so shaded walls, decks and roofs can turn green. Patios in shady backyards need a yearly clean too. Big trees in older neighborhoods fill gutters every fall, and townhouse complexes need work planned with the property manager. Winter brings snow and freeze-thaw days that leave driveways and steps icy. We plan Mississauga jobs around all of it, from spring soft washing to fall gutters and winter snow removal.',
    neighborhoods: [
      {
        name: 'Port Credit',
        blurb:
          'Lakeside homes on leafy streets, where moisture and wind make soft washing and window cleaning worth keeping up with.',
        imageLabel: 'Port Credit home near the lake',
      },
      {
        name: 'Streetsville',
        blurb:
          'Older homes near the village main street, where gentle soft washing protects brick, wood and paint.',
        imageLabel: 'Older home near Streetsville’s main street',
      },
      {
        name: 'Meadowvale',
        blurb:
          'Family homes and townhouses near parks and trails, a good fit for gutter cleaning and snow removal.',
        imageLabel: 'Meadowvale townhouses beside a park',
      },
      {
        name: 'Lorne Park',
        blurb:
          'Large lots and tall trees, where leaves, moss and long driveways keep crews busy every fall and winter.',
        imageLabel: 'Lorne Park home on a large treed lot',
      },
    ],
    whyChooseUs:
      'Mississauga has homes from every decade since the war. We match the method to each one, and we work with property managers on townhouse complexes.',
    faqs: [
      {
        question: 'Do you serve all of Mississauga?',
        answer:
          'Yes, from Port Credit and Lorne Park up to Meadowvale and Malton. Use the postal code checker to confirm your address.',
      },
      {
        question: 'Do you work with property managers and condo boards?',
        answer:
          'Yes. Property managers and condo boards can request a commercial bid for one building or a whole complex.',
      },
      {
        question: 'My home is near the lake. How often should I wash it?',
        answer:
          'Homes near the lake often see more mildew and algae on shaded sides, so many owners book a wash every spring.',
      },
    ],
  },
]
