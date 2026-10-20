import type { DiscountSeed, PricingRuleSeed } from '../types'

/**
 * PLACEHOLDER pricing (brief §10.4). Every number here is a stand-in, seeded with
 * needsReview: true. The live site shows "Request a quote" instead of these prices until the
 * owner reviews each rule. An add-on answer of "*" means "price × the number answered".
 */

const homeSizes = (question = 'home_size') => [
  { question, answer: '1,500–2,500 sq ft', factor: 1.3 },
  { question, answer: '2,500–3,500 sq ft', factor: 1.6 },
  { question, answer: 'Over 3,500 sq ft', factor: 2 },
]
const storyFactors = (two: number, three: number) => [
  { question: 'stories', answer: '2', factor: two },
  { question: 'stories', answer: '3', factor: three },
]
const roomFactors = [
  { question: 'bedrooms', answer: '2', factor: 1.15 },
  { question: 'bedrooms', answer: '3', factor: 1.35 },
  { question: 'bedrooms', answer: '4', factor: 1.55 },
  { question: 'bedrooms', answer: '5+', factor: 1.8 },
  { question: 'bathrooms', answer: '2', factor: 1.15 },
  { question: 'bathrooms', answer: '3', factor: 1.3 },
  { question: 'bathrooms', answer: '4+', factor: 1.45 },
]
const yardFactors = [
  { question: 'yard_size', answer: 'Medium', factor: 1.6 },
  { question: 'yard_size', answer: 'Large', factor: 2.4 },
]

export const pricingRules: PricingRuleSeed[] = [
  {
    service: 'pressure-washing',
    unit: 'sq_ft',
    quantityQuestion: 'area',
    baseFee: 0,
    unitRate: 0.25,
    minCharge: 150,
    multipliers: [
      { question: 'surface', answer: 'Pavers', factor: 1.2 },
      { question: 'surface', answer: 'Brick', factor: 1.15 },
      { question: 'surface', answer: 'Natural stone', factor: 1.3 },
    ],
    addOns: [{ question: 'stains', price: 40 }],
  },
  {
    service: 'soft-washing',
    unit: 'sq_ft',
    quantityQuestion: 'area',
    baseFee: 0,
    unitRate: 0.2,
    minCharge: 200,
    multipliers: [
      { question: 'surface', answer: 'Stucco', factor: 1.15 },
      { question: 'surface', answer: 'Brick', factor: 1.1 },
      { question: 'surface', answer: 'Painted wood', factor: 1.1 },
    ],
  },
  {
    service: 'house-washing',
    unit: 'job',
    baseFee: 0,
    unitRate: 300,
    minCharge: 300,
    multipliers: [
      ...homeSizes(),
      ...storyFactors(1.25, 1.5),
      { question: 'siding', answer: 'Stucco', factor: 1.15 },
      { question: 'siding', answer: 'Wood', factor: 1.1 },
      { question: 'siding', answer: 'Mixed', factor: 1.1 },
    ],
  },
  {
    service: 'driveway-cleaning',
    unit: 'sq_ft',
    quantityQuestion: 'area',
    baseFee: 0,
    unitRate: 0.2,
    minCharge: 120,
    multipliers: [
      { question: 'surface', answer: 'Pavers', factor: 1.2 },
      { question: 'surface', answer: 'Asphalt', factor: 0.9 },
    ],
    addOns: [{ question: 'stains', price: 40 }],
  },
  {
    service: 'patio-balcony-cleaning',
    unit: 'sq_ft',
    quantityQuestion: 'area',
    baseFee: 0,
    unitRate: 0.35,
    minCharge: 120,
    multipliers: [
      { question: 'space', answer: 'Upper balcony', factor: 1.3 },
      { question: 'surface', answer: 'Stone', factor: 1.15 },
      { question: 'surface', answer: 'Tile', factor: 1.1 },
      { question: 'surface', answer: 'Wood', factor: 1.1 },
      { question: 'surface', answer: 'Composite', factor: 1.1 },
    ],
  },
  {
    service: 'deck-cleaning',
    unit: 'sq_ft',
    quantityQuestion: 'area',
    baseFee: 0,
    unitRate: 0.6,
    minCharge: 175,
    multipliers: [
      { question: 'material', answer: 'Composite', factor: 0.9 },
      { question: 'material', answer: 'PVC', factor: 0.9 },
    ],
    addOns: [{ question: 'railings', price: 60 }],
  },
  {
    service: 'fence-cleaning',
    unit: 'linear_ft',
    quantityQuestion: 'length',
    baseFee: 0,
    unitRate: 1.5,
    minCharge: 150,
    multipliers: [
      { question: 'sides', answer: 'Both sides', factor: 1.8 },
      { question: 'material', answer: 'Wood', factor: 1.15 },
    ],
  },
  {
    service: 'gutter-cleaning',
    unit: 'job',
    baseFee: 0,
    unitRate: 150,
    minCharge: 150,
    multipliers: [...homeSizes(), ...storyFactors(1.3, 1.6)],
    addOns: [{ question: 'guards', price: 75 }],
  },
  {
    service: 'gutter-brightening',
    unit: 'linear_ft',
    quantityQuestion: 'length',
    baseFee: 0,
    unitRate: 1.25,
    minCharge: 150,
    multipliers: storyFactors(1.3, 1.6),
  },
  {
    service: 'roof-cleaning',
    unit: 'job',
    baseFee: 0,
    unitRate: 400,
    minCharge: 400,
    multipliers: [
      ...homeSizes(),
      { question: 'pitch', answer: 'Medium', factor: 1.15 },
      { question: 'pitch', answer: 'Steep', factor: 1.4 },
      { question: 'roof_type', answer: 'Cedar shake', factor: 1.3 },
      { question: 'roof_type', answer: 'Tile', factor: 1.25 },
      { question: 'roof_type', answer: 'Metal', factor: 0.9 },
    ],
  },
  {
    service: 'window-cleaning',
    unit: 'window',
    quantityQuestion: 'windows',
    baseFee: 0,
    unitRate: 6,
    minCharge: 150,
    multipliers: [
      { question: 'scope', answer: 'Inside and outside', factor: 1.8 },
      ...storyFactors(1.15, 1.3),
    ],
    addOns: [
      { question: 'screens', price: 40 },
      { question: 'tracks', price: 40 },
    ],
  },
  {
    service: 'driveway-sealing',
    unit: 'sq_ft',
    quantityQuestion: 'area',
    baseFee: 0,
    unitRate: 0.3,
    minCharge: 250,
    multipliers: [{ question: 'surface', answer: 'Concrete', factor: 1.1 }],
    addOns: [{ question: 'cracks', price: 75 }],
  },
  {
    service: 'house-cleaning',
    unit: 'job',
    baseFee: 0,
    unitRate: 120,
    minCharge: 120,
    multipliers: [...roomFactors, { question: 'pets', answer: 'yes', factor: 1.1 }],
    addOns: [
      { question: 'fridge', price: 35 },
      { question: 'oven', price: 35 },
    ],
  },
  {
    service: 'move-in-move-out-cleaning',
    unit: 'job',
    baseFee: 0,
    unitRate: 250,
    minCharge: 250,
    multipliers: roomFactors,
    addOns: [{ question: 'appliances', price: 80 }],
  },
  {
    service: 'garage-cleaning',
    unit: 'job',
    baseFee: 0,
    unitRate: 150,
    minCharge: 150,
    multipliers: [
      { question: 'garage_size', answer: '2-car', factor: 1.4 },
      { question: 'garage_size', answer: '3-car', factor: 1.8 },
      { question: 'declutter', answer: 'yes', factor: 1.6 },
    ],
  },
  {
    service: 'yard-cleanup',
    unit: 'job',
    baseFee: 0,
    unitRate: 200,
    minCharge: 200,
    multipliers: yardFactors,
    addOns: [{ question: 'haul_away', price: 60 }],
  },
  {
    service: 'leaf-removal',
    unit: 'job',
    baseFee: 0,
    unitRate: 175,
    minCharge: 175,
    multipliers: yardFactors,
    addOns: [{ question: 'haul_away', price: 60 }],
  },
  {
    service: 'fence-deck-staining',
    unit: 'sq_ft',
    quantityQuestion: 'size',
    baseFee: 0,
    unitRate: 2,
    minCharge: 400,
    multipliers: [
      { question: 'condition', answer: 'Weathered and gray', factor: 1.15 },
      { question: 'condition', answer: 'Peeling old stain', factor: 1.4 },
    ],
  },
  {
    service: 'garage-driveway-pressure-cleaning',
    unit: 'sq_ft',
    quantityQuestion: 'driveway_area',
    baseFee: 100,
    unitRate: 0.2,
    minCharge: 175,
    addOns: [
      { question: 'garage_size', answer: '2-car', price: 50 },
      { question: 'garage_size', answer: '3-car', price: 100 },
      { question: 'oil_stains', price: 40 },
    ],
  },
  {
    service: 'solar-panel-cleaning',
    unit: 'panel',
    quantityQuestion: 'panels',
    baseFee: 0,
    unitRate: 8,
    minCharge: 150,
    multipliers: [
      { question: 'mount', answer: '1-story roof', factor: 1.2 },
      { question: 'mount', answer: '2-story roof', factor: 1.4 },
    ],
  },
  {
    service: 'garbage-bin-cleaning',
    unit: 'bin',
    quantityQuestion: 'bins',
    baseFee: 0,
    unitRate: 15,
    minCharge: 30,
  },
  {
    service: 'christmas-light-installation',
    unit: 'linear_ft',
    quantityQuestion: 'roofline',
    baseFee: 150,
    unitRate: 5,
    minCharge: 350,
    multipliers: [
      ...storyFactors(1.2, 1.4),
      { question: 'lights', answer: 'Use my own lights', factor: 0.7 },
    ],
    addOns: [
      { question: 'trees', answer: '*', price: 60 },
      { question: 'shrubs', answer: '*', price: 25 },
    ],
  },
  { service: 'christmas-light-removal', unit: 'job', baseFee: 0, unitRate: 125, minCharge: 125 },
  { service: 'christmas-light-storage', unit: 'job', baseFee: 0, unitRate: 75, minCharge: 75 },
  {
    service: 'snow-removal',
    unit: 'job',
    baseFee: 0,
    unitRate: 550,
    minCharge: 550,
    multipliers: [
      { question: 'driveway', answer: '2 cars', factor: 1.3 },
      { question: 'driveway', answer: '3 cars', factor: 1.6 },
      { question: 'driveway', answer: '4+ cars', factor: 2 },
    ],
    addOns: [{ question: 'walkway_length', answer: '*', price: 2 }],
  },
  {
    service: 'driveway-snow-clearing',
    unit: 'job',
    baseFee: 0,
    unitRate: 450,
    minCharge: 450,
    multipliers: [
      { question: 'driveway', answer: '2 cars', factor: 1.3 },
      { question: 'driveway', answer: '3 cars', factor: 1.6 },
      { question: 'driveway', answer: '4+ cars', factor: 2 },
    ],
  },
  {
    service: 'walkway-sidewalk-snow-clearing',
    unit: 'linear_ft',
    quantityQuestion: 'walkway_length',
    baseFee: 150,
    unitRate: 3,
    minCharge: 200,
  },
  { service: 'salting-de-icing', unit: 'job', baseFee: 0, unitRate: 200, minCharge: 200 },
  { service: 'ice-control', unit: 'job', baseFee: 0, unitRate: 250, minCharge: 250 },
]

export const discounts: DiscountSeed[] = [
  { name: 'Bundle: 2 services', type: 'bundle', minServices: 2, percent: 5 },
  { name: 'Bundle: 3 or more services', type: 'bundle', minServices: 3, percent: 10 },
  { name: 'Twice a year', type: 'frequency', frequency: 'twice-yearly', percent: 5 },
  { name: 'Quarterly', type: 'frequency', frequency: 'quarterly', percent: 10 },
  { name: 'Monthly', type: 'frequency', frequency: 'monthly', percent: 15 },
]

type PlanSeed = {
  name: string
  kind: 'tier' | 'package'
  season?: 'spring' | 'summer' | 'fall' | 'winter'
  tagline: string
  price: number
  priceUnit: string
  features: string[]
  services: string[]
  highlighted?: boolean
}

export const plans: PlanSeed[] = [
  {
    name: 'Essential',
    kind: 'tier',
    tagline: 'The basics that protect your home.',
    price: 499,
    priceUnit: 'per year',
    features: [
      'House wash once a year',
      'Gutter cleaning in spring and fall',
      'Outside window cleaning once a year',
    ],
    services: ['house-washing', 'gutter-cleaning', 'window-cleaning'],
  },
  {
    name: 'Plus',
    kind: 'tier',
    tagline: 'Everything in Essential, plus a cleaner driveway and brighter windows.',
    price: 899,
    priceUnit: 'per year',
    features: [
      'Everything in Essential',
      'Windows inside and out, twice a year',
      'Driveway cleaning in spring',
      'Gutter brightening once a year',
    ],
    services: [
      'house-washing',
      'gutter-cleaning',
      'window-cleaning',
      'driveway-cleaning',
      'gutter-brightening',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    kind: 'tier',
    tagline: 'Every season handled, from spring cleaning to snow and lights.',
    price: 1999,
    priceUnit: 'per year',
    features: [
      'Everything in Plus',
      'Roof soft wash every other year',
      'Seasonal snow contract',
      'Holiday light installation and removal',
    ],
    services: [
      'house-washing',
      'gutter-cleaning',
      'window-cleaning',
      'roof-cleaning',
      'snow-removal',
      'christmas-light-installation',
    ],
  },
  {
    name: 'Spring refresh',
    kind: 'package',
    season: 'spring',
    tagline: 'Wash off winter in one visit.',
    price: 549,
    priceUnit: 'per visit',
    features: ['House wash', 'Window cleaning', 'Spring yard cleanup'],
    services: ['house-washing', 'window-cleaning', 'yard-cleanup'],
  },
  {
    name: 'Summer exterior',
    kind: 'package',
    season: 'summer',
    tagline: 'Protect wood and concrete while it’s dry.',
    price: 899,
    priceUnit: 'per visit',
    features: ['Deck cleaning', 'Fence or deck staining', 'Driveway sealing'],
    services: ['deck-cleaning', 'fence-deck-staining', 'driveway-sealing'],
  },
  {
    name: 'Fall prep',
    kind: 'package',
    season: 'fall',
    tagline: 'Ready for winter before the first snow.',
    price: 449,
    priceUnit: 'per visit',
    features: ['Gutter cleaning', 'Leaf removal', 'Driveway cleaning'],
    services: ['gutter-cleaning', 'leaf-removal', 'driveway-cleaning'],
  },
  {
    name: 'Winter care',
    kind: 'package',
    season: 'winter',
    tagline: 'Snow and ice handled all season.',
    price: 799,
    priceUnit: 'per season',
    features: [
      'Driveway and walkway clearing',
      'Salting after every visit',
      'Ice control for freezing rain',
    ],
    services: ['snow-removal', 'salting-de-icing', 'ice-control'],
  },
]
