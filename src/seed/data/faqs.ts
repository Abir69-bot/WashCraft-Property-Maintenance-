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

/**
 * General FAQs (2026-10 update). Answers describe how quoting actually works (a written
 * estimate before anything is booked) and promise no prices, response times, guarantees or
 * service options the owner hasn't confirmed.
 */
export const faqs: FaqSeed[] = [
  // General
  {
    category: 'general',
    showOnHome: true,
    question: 'What areas do you serve?',
    answer:
      'We currently serve the communities listed on our Service Areas page. Not on the list? Send a quote request anyway and we’ll tell you honestly whether we can help.',
  },
  {
    category: 'general',
    showOnHome: true,
    question: 'What services do you offer?',
    answer:
      'Interior house cleaning, commercial and restaurant cleaning, post-construction cleaning, exterior cleaning (pressure washing, soft washing, windows, gutters, roofs, driveway sealing, patios and balconies), snow removal and Christmas light installation.',
  },
  {
    category: 'general',
    question: 'Do I need to be home during the service?',
    answer:
      'Not always. For outdoor work we need access to the areas being cleaned and, for washing, an outdoor tap. For indoor work we agree how we’ll get in before the visit.',
  },
  {
    category: 'general',
    question: 'Do you clean carpets?',
    answer: 'No, we don’t offer carpet cleaning.',
  },
  // Quotes and estimates
  {
    category: 'pricing',
    showOnHome: true,
    question: 'How do I get a quote?',
    answer:
      'Send a quote request with a few details and photos if you have them. We review it, may ask a few questions or for more photos, and then send you a written estimate.',
  },
  {
    category: 'pricing',
    showOnHome: true,
    question: 'Are quotes free?',
    answer: 'Yes. Requesting a quote is free and you’re under no obligation to go ahead.',
  },
  {
    category: 'pricing',
    question: 'What’s in a written estimate?',
    answer:
      'The scope of the work, what’s not included, the price and the conditions. Nothing is booked until you approve it.',
  },
  {
    category: 'pricing',
    question: 'Do I pay online?',
    answer:
      'No. We don’t take payments on this website. After the job you receive an invoice or receipt.',
  },
  // Scheduling
  {
    category: 'scheduling',
    question: 'How soon can you come?',
    answer:
      'It depends on the job and the time of year. Tell us your preferred timing in your request and we’ll let you know what we can offer when we send your estimate.',
  },
  {
    category: 'scheduling',
    question: 'What happens if the weather turns?',
    answer:
      'Some outdoor work can’t be done safely or well in rain, high wind or freezing temperatures. If that happens we’ll contact you to pick a new date.',
  },
  // Exterior
  {
    category: 'exterior',
    question: 'Will washing damage my siding?',
    answer:
      'We use low-pressure soft washing for siding and other delicate surfaces, and save pressure washing for hard surfaces like concrete. If a surface is already damaged, we’ll point it out before we start.',
    services: ['soft-washing', 'pressure-washing'],
  },
  {
    category: 'exterior',
    question: 'Do you use my water?',
    answer:
      'For most washing we use your outdoor tap. If there isn’t one, tell us in your request so we can talk about options.',
    services: ['pressure-washing', 'soft-washing', 'patio-balcony-cleaning'],
  },
  {
    category: 'exterior',
    question: 'Can you clean high windows and roofs?',
    answer:
      'It depends on the height and the access. We confirm what we can safely reach in your written estimate, after seeing photos or the property.',
    services: ['window-cleaning', 'roof-cleaning', 'gutter-cleaning'],
  },
  // Interior
  {
    category: 'interior',
    question: 'Do you bring your own cleaning supplies?',
    answer:
      'We confirm supplies in your estimate. If you’d like us to use your products, tell us when you send your request.',
    services: ['house-cleaning', 'commercial-cleaning'],
  },
  {
    category: 'interior',
    question: 'Can you clean after a renovation?',
    answer:
      'Yes. Post-construction cleaning clears dust and residue after renovations and new builds. Book it for when the trades have finished.',
    services: ['post-construction-cleaning'],
  },
  // Snow
  {
    category: 'winter',
    question: 'When should I ask about snow removal?',
    answer:
      'Before winter starts is best, so we can plan your property ahead of the first snowfall. The options for your property are set out in your written estimate.',
    services: ['snow-removal'],
  },
  // Holiday
  {
    category: 'holiday',
    question: 'Do you take the lights down after the holidays?',
    answer:
      'Take-down is only included if your written estimate says so. Ask about it when you request a quote.',
    services: ['christmas-light-installation'],
  },
  {
    category: 'holiday',
    question: 'Can you use my own lights?',
    answer:
      'Whether we use your lights or supply them is confirmed in your estimate. If you’d like us to use yours, test them first and tell us in your request.',
    services: ['christmas-light-installation'],
  },
  // Commercial
  {
    category: 'commercial',
    showOnHome: true,
    question: 'Do you work with businesses and restaurants?',
    answer:
      'Yes. We offer commercial cleaning for offices, shops and common areas, and restaurant cleaning for dining rooms, washrooms and front-of-house areas.',
    services: ['commercial-cleaning', 'restaurant-cleaning'],
  },
  {
    category: 'commercial',
    question: 'Do you clean restaurant kitchen exhaust hoods?',
    answer: 'No. We don’t offer kitchen exhaust, hood, duct or grease trap cleaning.',
    services: ['restaurant-cleaning'],
  },
  {
    category: 'commercial',
    question: 'Can you work around our opening hours?',
    answer: 'Visit times are agreed with you when we quote. Tell us your hours in your request.',
    services: ['commercial-cleaning', 'restaurant-cleaning'],
  },
]
