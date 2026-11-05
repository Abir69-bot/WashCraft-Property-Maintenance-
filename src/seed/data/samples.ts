/**
 * Sample social proof and company content (brief §3.2, §16). Every item is seeded with
 * isSample: true, shows a "Sample" badge in development and preview, and never appears on the
 * live site. Replace with real content before launch.
 */

/**
 * Fictional reviews: made-up customers with natural, varied wording across the main services,
 * for checking the review section's layout in development and preview. Never real feedback, so
 * they never sit next to the owner's job photos, carry no Google link, and stay off the live site.
 */
export const sampleTestimonials: {
  name: string
  city: string
  service: string
  rating: number
  featured?: boolean
  quote: string
}[] = [
  {
    name: 'Priya S.',
    city: 'Markham',
    service: 'window-cleaning',
    rating: 5,
    featured: true,
    quote:
      'Our second-floor windows haven’t looked this clear since we moved in. They did the screens and sills too, and put down drop cloths inside before they started.',
  },
  {
    name: 'Daniel R.',
    city: 'North York',
    service: 'gutter-cleaning',
    rating: 5,
    quote:
      'Sent before and after photos of every run of gutter and pointed out a loose downspout bracket. No mess left on the driveway.',
  },
  {
    name: 'Siobhan M.',
    city: 'Etobicoke',
    service: 'snow-removal',
    rating: 4,
    quote:
      'Driveway and front steps were clear before we left for work most mornings. After the big February storm they came later than usual, but the job was still done well.',
  },
  {
    name: 'Marc-André T.',
    city: 'Scarborough',
    service: 'pressure-washing',
    rating: 5,
    quote:
      'Our interlock patio had turned green under the maple. Now you can see the real color of the stones again.',
  },
  {
    name: 'Grace L.',
    city: 'Richmond Hill',
    service: 'soft-washing',
    rating: 5,
    quote: 'Gentle on our older stucco, and the dark streaks under the eaves are gone.',
  },
  {
    name: 'Ahmed K.',
    city: 'Mississauga',
    service: 'pressure-washing',
    rating: 4,
    quote:
      'Booked a spring clean for the driveway and walkway. They worked carefully around the garden beds. One oil stain is still faintly there, which they warned us about up front.',
  },
  {
    name: 'Jenna and Rob P.',
    city: 'Vaughan',
    service: 'window-cleaning',
    rating: 5,
    quote: 'Easy to book and on time. Clear windows, no streaks.',
  },
  {
    name: 'Wei C.',
    city: 'Scarborough',
    service: 'snow-removal',
    rating: 5,
    quote:
      'Our walkway was salted every icy morning. With two kids and a dog going in and out, that made a real difference this winter.',
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

/** Generic logos drawn for the demo (src/seed/media/sample-logo-*.png), not real companies. */
export const sampleClientLogos = [
  { name: 'Sample Property Group', logo: 'sample-logo-property-group.png' },
  { name: 'Sample HOA Community', logo: 'sample-logo-hoa-community.png' },
  { name: 'Sample Retail Plaza', logo: 'sample-logo-retail-plaza.png' },
  { name: 'Sample Office Park', logo: 'sample-logo-office-park.png' },
  { name: 'Sample Condo Association', logo: 'sample-logo-condo-association.png' },
  { name: 'Sample Townhome Village', logo: 'sample-logo-townhome-village.png' },
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
