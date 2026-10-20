/**
 * Sample social proof and company content (brief §3.2, §16). Every item is seeded with
 * isSample: true, shows a "Sample" badge in development and preview, and never appears on the
 * live site. Replace with real content before launch.
 */

export const sampleTestimonials = [
  {
    name: 'Sample customer, Maria G.',
    city: 'Aurora',
    service: 'house-washing',
    rating: 5,
    featured: true,
    quote:
      'The crew showed up when they said, protected every plant and left the house looking freshly painted. The black streaks under the gutters are gone too.',
  },
  {
    name: 'Sample customer, Dan R.',
    city: 'Denver',
    service: 'gutter-cleaning',
    rating: 5,
    quote:
      'Before and after photos of every gutter, plus a heads-up about a loose downspout. Very thorough.',
  },
  {
    name: 'Sample customer, Priya S.',
    city: 'Centennial',
    service: 'window-cleaning',
    rating: 5,
    quote:
      'Our second-story windows haven’t been this clear since we moved in. No streaks anywhere.',
  },
  {
    name: 'Sample customer, Tom and Elise W.',
    city: 'Lakewood',
    service: 'snow-removal',
    rating: 5,
    quote:
      'Every storm, the driveway and walk were clear before we left for work. We didn’t pick up a shovel all winter.',
  },
  {
    name: 'Sample customer, Kevin L.',
    city: 'Littleton',
    service: 'fence-deck-staining',
    rating: 5,
    quote: 'They cleaned the deck, let it dry and came back to stain it. It looks brand new.',
  },
  {
    name: 'Sample customer, Hannah M.',
    city: 'Arvada',
    service: 'christmas-light-installation',
    rating: 5,
    quote:
      'Perfectly straight roofline lights and they took them down in January. Booking again this year.',
  },
]

export const sampleTeam = [
  {
    name: 'Alex Morgan',
    slug: 'alex-morgan',
    role: 'Founder (sample)',
    isFounder: true,
    shortBio:
      'Sample founder bio. Alex started WashCraft to bring careful, year-round property care to {region}.',
    bio: 'This is a sample founder story. Replace it with your own: how you started, why you care about doing the job properly and what customers can expect when they book with you. Mention the services you started with, how the business has grown, and what you’re proud of. Keep it personal and specific.',
    photoLabel: 'Founder portrait outdoors in natural light, in work clothes',
    specialities: ['Soft washing', 'Roof cleaning', 'Customer care'],
  },
  {
    name: 'Jordan Lee',
    slug: 'jordan-lee',
    role: 'Exterior crew lead (sample)',
    shortBio: 'Sample bio. Jordan leads exterior cleaning crews and trains new technicians.',
    bio: 'This is a sample team bio. Replace it with a real team member’s background, what they do day to day and something personal.',
    photoLabel: 'Crew lead next to a soft-wash rig',
    specialities: ['House washing', 'Window cleaning', 'Crew training'],
  },
  {
    name: 'Sam Patel',
    slug: 'sam-patel',
    role: 'Winter operations (sample)',
    shortBio: 'Sample bio. Sam plans snow routes and keeps winter crews on schedule.',
    bio: 'This is a sample team bio. Replace it with a real team member’s background and responsibilities.',
    photoLabel: 'Team member with a snow blower beside a cleared driveway',
    specialities: ['Snow routes', 'Ice control', 'Commercial accounts'],
  },
  {
    name: 'Taylor Brooks',
    slug: 'taylor-brooks',
    role: 'Customer care (sample)',
    shortBio: 'Sample bio. Taylor answers calls and texts and schedules every job.',
    bio: 'This is a sample team bio. Replace it with a real team member’s background and responsibilities.',
    photoLabel: 'Team member at a desk with a headset, smiling',
    specialities: ['Scheduling', 'Quotes', 'Customer questions'],
  },
]

export const sampleGallery = [
  {
    caption: 'Two-story vinyl house wash',
    service: 'house-washing',
    city: 'Aurora',
    before: 'Vinyl siding with green algae on the north wall',
    after: 'Same wall after soft washing, bright and even',
  },
  {
    caption: 'Concrete driveway with tire marks',
    service: 'driveway-cleaning',
    city: 'Denver',
    before: 'Gray driveway with tire marks and leaf stains',
    after: 'Same driveway after cleaning, light and even',
  },
  {
    caption: 'Shingle roof with black streaks',
    service: 'roof-cleaning',
    city: 'Lakewood',
    before: 'Roof with black algae streaks',
    after: 'Same roof after soft-wash treatment',
  },
  {
    caption: 'Cedar deck restored',
    service: 'deck-cleaning',
    city: 'Littleton',
    before: 'Gray, weathered cedar deck',
    after: 'Same deck cleaned and brightened',
  },
  {
    caption: 'Wood fence cleaned and stained',
    service: 'fence-deck-staining',
    city: 'Centennial',
    before: 'Weathered gray fence',
    after: 'Same fence stained a warm cedar tone',
  },
  {
    caption: 'Gutter faces brightened',
    service: 'gutter-brightening',
    city: 'Arvada',
    before: 'White gutter with black tiger stripes',
    after: 'Same gutter, bright white',
  },
]

export const sampleClientLogos = [
  'Sample Property Group',
  'Sample HOA Community',
  'Sample Retail Plaza',
  'Sample Office Park',
  'Sample Condo Association',
  'Sample Townhome Village',
]

export const sampleJobs = [
  {
    title: 'Exterior Cleaning Technician',
    slug: 'exterior-cleaning-technician',
    employmentType: 'full-time' as const,
    location: '{region}',
    summary:
      'Sample job opening. Join our exterior crew to soft wash homes, clean windows and gutters and keep customers happy.',
    responsibilities: [
      'Soft wash and pressure wash homes and hard surfaces',
      'Clean windows, gutters and roofs safely',
      'Protect landscaping and leave every site tidy',
      'Explain the work to customers on site',
    ],
    requirements: [
      'Comfortable working outdoors and on ladders',
      'Valid driver’s license',
      'Reliable and on time',
    ],
    niceToHave: ['Pressure washing or window cleaning experience'],
  },
  {
    title: 'Seasonal Snow Crew Member',
    slug: 'seasonal-snow-crew-member',
    employmentType: 'seasonal' as const,
    location: '{region}',
    summary:
      'Sample job opening. Help keep driveways and walkways clear on our winter snow routes.',
    responsibilities: [
      'Clear driveways, walkways and sidewalks after snowfall',
      'Apply salt and ice melt',
      'Log each visit on the route',
    ],
    requirements: [
      'Available for early mornings during storms',
      'Able to do physical work in the cold',
      'Valid driver’s license',
    ],
    niceToHave: ['Snow blower or plow experience'],
  },
]
