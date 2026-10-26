type FaqSeed = {
  question: string
  answer: string
  category:
    | 'general'
    | 'pricing'
    | 'scheduling'
    | 'exterior'
    | 'interior'
    | 'winter'
    | 'holiday'
    | 'yard'
    | 'commercial'
  services?: string[]
  showOnHome?: boolean
}

export const faqs: FaqSeed[] = [
  // General
  {
    category: 'general',
    showOnHome: true,
    question: 'What areas do you serve?',
    answer:
      'We serve homes and businesses across {region}. Enter your postal code in the checker on our Areas page to confirm, or just ask. We’ll tell you if we can help.',
  },
  {
    category: 'general',
    showOnHome: true,
    question: 'Do I need to be home during the service?',
    answer:
      'For most outdoor services, no. We need access to the work area and an outdoor water tap. For indoor services, you can let us in or share a door code. We’ll message you when we arrive and when we’re done.',
  },
  {
    category: 'general',
    question: 'What should I do before you arrive?',
    answer:
      'For outdoor work: close windows, move cars and fragile items away from the work area, and make sure we can reach an outdoor tap. For indoor work: pick up clutter so we can reach the surfaces. We handle the rest.',
  },
  {
    category: 'general',
    question: 'Are your cleaning products safe for kids, pets and plants?',
    answer:
      'We choose products for each surface and use them diluted. We soak and rinse plants before and after, and ask that kids and pets stay inside until surfaces are rinsed and dry, usually within an hour.',
  },
  // Pricing
  {
    category: 'pricing',
    showOnHome: true,
    question: 'How do you price your services?',
    answer:
      'Most home services have an instant price range online, based on size and a few details. Larger or unusual jobs get a custom quote from photos, and some need a quick site visit. You’ll always know the price before we start.',
  },
  {
    category: 'pricing',
    question: 'Why do you show a price range?',
    answer:
      'Online answers are estimates. The range covers small differences we may find on site, like extra staining or access. We confirm the final price before any work begins.',
  },
  {
    category: 'pricing',
    question: 'Do you offer discounts for bundling services?',
    answer:
      'Yes. Booking two or more services together, or choosing a recurring schedule, lowers the price. The instant-price wizard applies these discounts automatically.',
  },
  {
    category: 'pricing',
    question: 'Do I pay online?',
    answer:
      'No payment is taken on this website. We explain payment options with your quote, and seasonal contracts show their payment schedule when you sign up.',
  },
  // Scheduling
  {
    category: 'scheduling',
    showOnHome: true,
    question: 'How soon can you come?',
    answer:
      'It depends on the season and the service. Spring and fall fill up quickly, so booking a couple of weeks ahead is best. Ask for the next available date when you request a quote.',
  },
  {
    category: 'scheduling',
    question: 'What happens if it rains on my booking day?',
    answer:
      'Light rain doesn’t affect most washing. For heavy rain, wind, lightning or staining jobs, we’ll reschedule to the next good day and let you know.',
  },
  {
    category: 'scheduling',
    question: 'Can I set up a recurring schedule?',
    answer:
      'Yes. Many services can repeat twice a year, quarterly or monthly. Our maintenance plans bundle the most popular services into one yearly schedule.',
  },
  {
    category: 'scheduling',
    question: 'Can I reschedule or cancel?',
    answer:
      'Yes. Please give us at least 48 hours’ notice so we can offer the time to someone else.',
  },
  // Exterior
  {
    category: 'exterior',
    showOnHome: true,
    question: 'Will washing damage my siding or roof?',
    answer:
      'No. Siding and roofs are soft washed at low pressure with a cleaning solution. We only use high pressure on hard surfaces like concrete, and we adjust it for each material.',
    services: ['soft-washing', 'house-washing', 'roof-cleaning'],
  },
  {
    category: 'exterior',
    question: 'How often should I wash my house?',
    answer: 'Once a year for most homes. Shady homes or homes near trees may want spring and fall.',
    services: ['house-washing'],
  },
  {
    category: 'exterior',
    question: 'How often should gutters be cleaned?',
    answer:
      'Twice a year for most homes: late spring and late fall. Homes under big trees may need more.',
    services: ['gutter-cleaning'],
  },
  {
    category: 'exterior',
    question: 'Do you use my water?',
    answer:
      'Yes, for most exterior jobs we connect to an outdoor tap. The water used costs very little. If you don’t have an outdoor tap, let us know.',
  },
  // Interior
  {
    category: 'interior',
    question: 'Do you bring your own cleaning supplies?',
    answer:
      'Yes, everything we need. If you prefer certain products, leave them out and we’ll use them.',
    services: ['house-cleaning', 'move-in-move-out-cleaning'],
  },
  {
    category: 'interior',
    question: 'Is the first house cleaning different?',
    answer:
      'It usually takes longer because we catch up on built-up dirt. Regular visits after that are quicker.',
    services: ['house-cleaning'],
  },
  {
    category: 'interior',
    question: 'What won’t you take in junk removal?',
    answer:
      'Hazardous materials like paint, chemicals, propane tanks and anything with asbestos. Ask about anything you’re unsure of.',
    services: ['junk-removal'],
  },
  {
    category: 'interior',
    question: 'Can you clean a home before I move in?',
    answer:
      'Yes. Book a move-in clean for after the previous owners leave and before your movers arrive.',
    services: ['move-in-move-out-cleaning'],
  },
  // Winter
  {
    category: 'winter',
    showOnHome: true,
    question: 'How does a snow contract work?',
    answer:
      'You sign up before winter and choose a trigger depth. Your property goes on a route, and we clear it after every snowfall that reaches that depth, all season, without you having to call.',
    services: ['snow-removal', 'driveway-snow-clearing', 'walkway-sidewalk-snow-clearing'],
  },
  {
    category: 'winter',
    question: 'When should I sign up for snow removal?',
    answer:
      'In the fall. Routes are planned before the first storm and fill up, so early sign-up is best.',
    services: ['snow-removal'],
  },
  {
    category: 'winter',
    question: 'Is salting included?',
    answer:
      'Salting is an add-on so you can choose it. Most customers add it for steps and walkways.',
    services: ['salting-de-icing'],
  },
  {
    category: 'winter',
    question: 'What if you damage my lawn with the snow blower?',
    answer:
      'We stake driveway and walkway edges before the first snow to prevent damage. If something does get damaged, tell us and we’ll look at it in spring.',
    services: ['driveway-snow-clearing'],
  },
  // Holiday
  {
    category: 'holiday',
    question: 'When should I book Christmas light installation?',
    answer:
      'September or October for the best choice of dates. Install dates fill up through November.',
    services: ['christmas-light-installation'],
  },
  {
    category: 'holiday',
    question: 'Can you use my own lights?',
    answer: 'Yes. We test them first and can replace any strands that don’t work.',
    services: ['christmas-light-installation'],
  },
  {
    category: 'holiday',
    question: 'Do you take the lights down?',
    answer: 'Yes, in January. You can also have us store them until next season.',
    services: ['christmas-light-removal', 'christmas-light-storage'],
  },
  {
    category: 'holiday',
    question: 'Will light clips damage my roof or gutters?',
    answer: 'No. We use clips made for shingles and gutters, never nails or staples.',
    services: ['christmas-light-installation'],
  },
  // Yard
  {
    category: 'yard',
    question: 'When is the best time for a spring cleanup?',
    answer: 'After the snow melts and the ground firms up, usually late March to April.',
    services: ['yard-cleanup'],
  },
  {
    category: 'yard',
    question: 'Do you haul away yard waste?',
    answer:
      'Yes. Leaves, branches and debris are bagged and taken away unless you want to keep them.',
    services: ['yard-cleanup', 'leaf-removal'],
  },
  {
    category: 'yard',
    question: 'Should I clean my fence before staining it?',
    answer:
      'Yes. Stain soaks into clean, dry wood much better and lasts longer. We clean first and stain after the wood dries.',
    services: ['fence-cleaning', 'fence-deck-staining'],
  },
  {
    category: 'yard',
    question: 'Can I pause garbage bin cleaning in winter?',
    answer: 'Yes. Many customers pause during the coldest months.',
    services: ['garbage-bin-cleaning'],
  },
  // Commercial
  {
    category: 'commercial',
    question: 'Do you work with HOAs and property managers?',
    answer:
      'Yes. We offer one point of contact, scheduled services and resident notices, and we confirm the paperwork your board needs with each bid.',
  },
  {
    category: 'commercial',
    showOnHome: true,
    question: 'What paperwork can you provide with a bid?',
    answer:
      'Tell us what your board, manager or insurer requires when you request a bid, and we’ll confirm what we can include with the proposal.',
  },
  {
    category: 'commercial',
    question: 'Can you work outside business hours?',
    answer: 'Yes. Early mornings, evenings and weekends can be scheduled to suit your property.',
  },
  {
    category: 'commercial',
    question: 'Do you offer annual contracts?',
    answer:
      'Yes. A year-round contract can cover washing, windows, gutters, snow and lighting with one invoice schedule.',
    services: ['commercial-property-maintenance'],
  },
]
