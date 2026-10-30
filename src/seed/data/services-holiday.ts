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
    headline: 'Holiday lights, hung for you',
    promise: 'Christmas light installation for homes and businesses in {region}.',
    summary:
      'Christmas light installation for rooflines, windows, trees and shrubs. What’s included, and whether take-down is part of it, is confirmed in your written estimate.',
    outcomeLabel: 'Ask about holiday lights',
    bullets: [
      'Rooflines, trees and shrubs',
      'Homes and storefronts',
      'Inclusions confirmed in writing',
    ],
    heroImageLabel: 'Two-story home at dusk with warm white roofline lights and lit trees',
    problem:
      'Hanging lights means ladders, cold hands and hours of untangling. Rooflines and tall trees are the hardest part, and the most risky to do yourself.',
    benefits: [
      {
        title: 'No ladder for you',
        body: 'Skip the climbing and the untangling.',
      },
      {
        title: 'A neat display',
        body: 'Lights hung evenly along the lines of the house and garden.',
      },
      {
        title: 'Clear inclusions',
        body: 'Your estimate spells out the lights, areas and any take-down.',
      },
    ],
    included: [
      'Installation on the areas listed in your estimate',
      'A test of the lights once they’re up',
      'Lights and any take-down as set out in your estimate',
    ],
    suitableFor: [
      'Homeowners who want a holiday display without the ladder',
      'Storefronts, restaurants and small businesses',
      'Landlords and property managers decorating shared entrances',
    ],
    exclusions: [
      'Whether we supply the lights, use yours, take them down or store them is confirmed in your estimate. Nothing is included unless it’s listed there.',
      'Electrical work, new outlets and timers wired into your electrical system are not included.',
      'Rooflines we can’t reach safely are confirmed case by case when we quote.',
    ],
    preparation: [
      'Request a quote early in the season and send photos of the house.',
      'If we’re using your lights, test them and have them ready.',
      'Make sure there are working outdoor outlets near the display.',
    ],
    method:
      'We plan the display with you, install along the areas in your estimate and test everything before we leave.',
    safety:
      'We only work on rooflines and trees we can reach safely, and we keep cords tidy and clear of walkways.',
    process: [
      {
        title: 'Send a request',
        body: 'Use the quote form or call. Photos help us understand the job.',
      },
      {
        title: 'We review it',
        body: 'We look at the details and may ask for more photos or a quick visit.',
      },
      {
        title: 'Written estimate',
        body: 'You get the scope, exclusions, price and conditions in writing.',
      },
      {
        title: 'Approve and schedule',
        body: 'Once you approve the estimate, we confirm a date that suits you.',
      },
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
        question: 'Do you supply the lights?',
        answer: 'We confirm whether we supply lights or use yours in your written estimate.',
      },
      {
        question: 'Do you take the lights down after the holidays?',
        answer:
          'Take-down is only included if your estimate says so. Ask about it when you request a quote.',
      },
      {
        question: 'When should I book?',
        answer:
          'Early in the season is best. Send your request as soon as you know what you’d like.',
      },
    ],
    related: ['snow-removal', 'gutter-cleaning', 'window-cleaning'],
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
