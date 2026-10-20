import { ask, stories } from '../questions'
import type { ServiceSeed } from '../types'

export const holidayServices: ServiceSeed[] = [
  {
    slug: 'christmas-light-installation',
    title: 'Christmas Light Installation',
    category: 'holiday-lighting',
    icon: 'lightbulb',
    quoteMode: 'instant',
    dedicatedFlow: 'holiday-lights',
    seasons: ['holiday'],
    bookingWindowNote:
      'Installs run from late October. Book by mid-November for a pre-Thanksgiving install.',
    headline: 'The brightest house on the block, without the ladder',
    promise: 'Holiday lights designed, installed and maintained across {region}.',
    summary:
      'Professional Christmas light installation for rooflines, trees and shrubs, with your lights or ours.',
    outcomeLabel: 'Book your lights',
    bullets: ['Rooflines, trees and shrubs', 'Your lights or ours', 'Removal in January'],
    heroImageLabel: 'Two-story home at dusk with warm white roofline lights and lit trees',
    problem:
      'Hanging lights means hours on a ladder in the cold, tangled strands and half a string that won’t light. Then you do it all again in reverse in January.',
    benefits: [
      { title: 'No ladders for you', body: 'We do the climbing, clipping and plugging in.' },
      {
        title: 'A clean, even look',
        body: 'Lights are clipped in straight lines along the roofline and wrapped evenly on trees.',
      },
      {
        title: 'Taken care of all season',
        body: 'If a strand goes out, we fix it. In January we take everything down.',
      },
    ],
    included: [
      'Design to suit your home',
      'Roofline, trees, shrubs and railings',
      'Clips that don’t damage shingles or gutters',
      'Timers set up',
      'Repair visits for strand outages during the season',
    ],
    method:
      'We measure the roofline and plan where lights, timers and outlets go. Lights are clipped to gutters or shingles with clips that don’t damage them, never nailed or stapled. Trees and shrubs are wrapped evenly. Use your own lights or choose commercial-grade LEDs from us.',
    safety:
      'Roof work uses fall protection. We use outdoor-rated cords and timers, keep connections off the ground and never overload outlets.',
    process: [
      {
        title: 'Get a price',
        body: 'Tell us the roofline length, stories and what you’d like lit.',
      },
      { title: 'Pick a style', body: 'Warm white, multicolor or custom.' },
      { title: 'Install', body: 'We hang and test everything on your install date.' },
      { title: 'January removal', body: 'We take everything down and store it if you like.' },
    ],
    priceFactors: [
      'Roofline length',
      'Number of stories',
      'Trees, shrubs and railings',
      'Your lights or ours',
    ],
    addOns: [
      { name: 'Removal', description: 'Careful take-down in January.' },
      { name: 'Storage', description: 'Lights labeled and stored until next season.' },
    ],
    faqs: [
      {
        question: 'When should I book?',
        answer: 'As early as September. Install dates fill up through November.',
      },
      {
        question: 'Can you use my lights?',
        answer: 'Yes. We test them first. Strands that don’t work can be replaced with ours.',
      },
      {
        question: 'Will clips damage my roof or gutters?',
        answer: 'No. We use clips made for shingles and gutters, never nails or staples.',
      },
      {
        question: 'What if a strand goes out?',
        answer: 'Let us know and we’ll fix it during the season.',
      },
      {
        question: 'When do you take them down?',
        answer: 'In January, after the holidays, on a date that suits you.',
      },
    ],
    related: ['christmas-light-removal', 'christmas-light-storage', 'permanent-led-lighting'],
    questions: [
      ask.number('roofline', 'Roofline to light', {
        min: 0,
        max: 1000,
        unit: 'linear ft',
        helpText: 'Front of the house only is usually 40–100 feet.',
      }),
      stories,
      ask.number('trees', 'Trees to wrap', { min: 0, max: 30, unit: 'trees' }),
      ask.number('shrubs', 'Shrubs to light', { min: 0, max: 50, unit: 'shrubs' }),
      ask.select('lights', 'Whose lights?', ['Supply lights for me', 'Use my own lights']),
    ],
  },
  {
    slug: 'christmas-light-removal',
    title: 'Christmas Light Removal',
    category: 'holiday-lighting',
    icon: 'archive',
    quoteMode: 'addon',
    parent: 'christmas-light-installation',
    seasons: ['holiday'],
    bookingWindowNote: 'Removal runs through January.',
    headline: 'Lights down in January, carefully',
    promise: 'Holiday light take-down without broken strands or damaged gutters.',
    summary: 'Careful removal of holiday lights, clips and timers in January.',
    outcomeLabel: 'Book removal',
    bullets: ['Lights, clips and timers', 'Strands tested and coiled', 'Ready for storage'],
    heroImageLabel: 'Technician coiling light strands into a labeled bin',
    problem:
      'Taking lights down in January is cold, fiddly work. Pull too hard and you crack clips, scratch gutters and tangle strands for next year.',
    benefits: [
      { title: 'No damage', body: 'Clips are released one by one, not yanked off.' },
      { title: 'Ready for next year', body: 'Strands are tested, coiled and labeled by area.' },
      { title: 'One less January job', body: 'We handle it on a day that suits you.' },
    ],
    included: [
      'Removal of lights, clips and timers',
      'Strands tested and coiled',
      'Labels by area of the home',
    ],
    method:
      'We work along the roofline releasing clips by hand, coil each strand and label where it came from, so next year’s install goes faster.',
    process: [
      { title: 'Add to your install', body: 'Removal is booked with installation.' },
      { title: 'Pick a January date', body: 'Any day that suits you.' },
      { title: 'Take down', body: 'Lights and clips removed carefully.' },
      { title: 'Pack', body: 'Coiled, labeled and ready to store.' },
    ],
    priceFactors: ['Amount of lighting', 'Number of stories'],
    faqs: [
      {
        question: 'Can you remove lights you installed yourself?',
        answer: 'Yes. Ask for a quote with photos of your display.',
      },
      {
        question: 'Is removal included with installation?',
        answer: 'It’s an add-on, so you can choose what you need.',
      },
      {
        question: 'What if it’s icy in January?',
        answer: 'We wait for a safe day. Your lights stay off and safe until then.',
      },
      {
        question: 'Do you keep the lights?',
        answer: 'They’re yours. We leave them with you or store them if you add storage.',
      },
      {
        question: 'Do you remove permanent lights?',
        answer: 'Permanent LED lighting stays up all year, so it never needs removal.',
      },
    ],
    related: ['christmas-light-installation', 'christmas-light-storage', 'permanent-led-lighting'],
  },
  {
    slug: 'christmas-light-storage',
    title: 'Christmas Light Storage',
    category: 'holiday-lighting',
    icon: 'package',
    quoteMode: 'addon',
    parent: 'christmas-light-installation',
    seasons: ['holiday'],
    bookingWindowNote: 'Added to removal in January.',
    headline: 'We keep your lights until next season',
    promise: 'Labeled, dry storage so your lights are ready when it’s time to hang them.',
    summary:
      'Off-season storage for your holiday lights, labeled and ready for next year’s install.',
    outcomeLabel: 'Add storage',
    bullets: ['Labeled by area', 'Dry storage', 'Returned for next install'],
    heroImageLabel: 'Shelves of labeled storage bins in a dry storeroom',
    problem:
      'Lights take up a lot of garage and basement space, and they get crushed or tangled in storage.',
    benefits: [
      { title: 'Free up space', body: 'No more bins taking up room for 11 months.' },
      { title: 'Ready to hang', body: 'Lights come back labeled and tested.' },
      { title: 'Protected', body: 'Stored dry and off the floor.' },
    ],
    included: [
      'Labeled bins',
      'Dry storage until next season',
      'Delivery with next year’s install',
    ],
    method:
      'After removal, lights go into labeled bins and are kept in dry storage. They come back with the crew on your next install date.',
    process: [
      { title: 'Add to removal', body: 'Choose storage with January removal.' },
      { title: 'Pack and label', body: 'Each strand labeled by area.' },
      { title: 'Store', body: 'Kept dry until next season.' },
      { title: 'Reinstall', body: 'Lights arrive with your crew.' },
    ],
    priceFactors: ['Number of bins', 'Season length'],
    faqs: [
      {
        question: 'Can I get my lights back early?',
        answer: 'Yes. Give us a few days’ notice.',
      },
      {
        question: 'Do you store lights you hung yourself?',
        answer: 'Storage is for lights we take down, so we know they’re packed properly.',
      },
      {
        question: 'Are they insured in storage?',
        answer: 'Ask us about coverage when you book.',
      },
      {
        question: 'Do you test them before reinstalling?',
        answer: 'Yes. Strands are tested before they go up.',
      },
      {
        question: 'Is there a minimum?',
        answer: 'Storage is priced per season by the number of bins.',
      },
    ],
    related: ['christmas-light-removal', 'christmas-light-installation', 'permanent-led-lighting'],
  },
]
