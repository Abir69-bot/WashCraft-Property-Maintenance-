import { ask, garageSize, yardSize } from '../questions'
import type { ServiceSeed } from '../types'

export const yardServices: ServiceSeed[] = [
  {
    slug: 'yard-cleanup',
    title: 'Spring & Fall Yard Cleanup',
    category: 'yard-care',
    icon: 'leaf',
    quoteMode: 'instant',
    seasons: ['spring', 'fall'],
    bookingWindowNote: 'Spring cleanups start after snowmelt. Fall cleanups book up in October.',
    headline: 'A tidy yard at the start and end of every season',
    promise: 'Seasonal yard cleanups for {region} homes, with debris hauled away.',
    summary:
      'Spring and fall yard cleanups: leaves, branches, beds, edges and lawn debris raked, bagged and hauled away.',
    outcomeLabel: 'Get a tidy yard',
    bullets: ['Leaves, sticks and debris', 'Beds cleared and edged', 'Hauled away'],
    heroImageLabel: 'Freshly raked lawn with edged garden beds in spring',
    problem:
      'Winter leaves behind branches, matted leaves and dead plants. Fall buries the lawn in leaves that smother grass if left too long. Cleaning up takes weekends and a lot of yard bags.',
    benefits: [
      {
        title: 'Healthier lawn',
        body: 'Removing matted leaves lets grass breathe and green up in spring.',
      },
      { title: 'Neat beds', body: 'Dead growth is cut back and beds are edged.' },
      { title: 'Nothing left behind', body: 'We bag and haul away all the debris.' },
    ],
    included: [
      'Raking and blowing leaves from lawn and beds',
      'Pickup of sticks and fallen branches',
      'Cutting back dead perennials',
      'Edging beds and walkways',
      'Debris bagged and hauled away',
    ],
    method:
      'We work from the beds out: cut back dead growth, clear the beds, then rake and blow the lawn and hard surfaces. Everything is bagged and taken away.',
    process: [
      { title: 'Get a price', body: 'Tell us the yard size and how much debris there is.' },
      { title: 'Clear', body: 'Beds, lawn and hard surfaces.' },
      { title: 'Edge', body: 'Beds and walkways get clean edges.' },
      { title: 'Haul', body: 'Debris leaves with us.' },
    ],
    priceFactors: ['Yard size', 'Amount of debris', 'Haul-away'],
    faqs: [
      {
        question: 'When should I book a spring cleanup?',
        answer:
          'Once the snow has melted and the ground has firmed up, usually late March to April.',
      },
      {
        question: 'Do you mow too?',
        answer: 'Cleanups don’t include regular mowing. Ask us about seasonal maintenance.',
      },
      {
        question: 'Do you take the debris?',
        answer: 'Yes, unless you’d like to keep leaves for compost.',
      },
      {
        question: 'Can you prune shrubs?',
        answer: 'Light shaping, yes. Big pruning jobs are quoted separately.',
      },
      {
        question: 'What about my garden beds?',
        answer:
          'Beds are cleared of debris and edged. Deeper bed work is part of garden bed cleanup.',
      },
    ],
    related: ['leaf-removal', 'garden-bed-cleanup', 'gutter-cleaning'],
    questions: [
      yardSize,
      ask.number('bags', 'About how many bags of debris?', {
        min: 0,
        max: 100,
        unit: 'bags',
        helpText: 'A rough guess is fine.',
      }),
      ask.yesNo('haul_away', 'Haul the debris away?'),
    ],
  },
  {
    slug: 'leaf-removal',
    title: 'Leaf Removal',
    category: 'yard-care',
    icon: 'wind',
    quoteMode: 'instant',
    seasons: ['fall'],
    bookingWindowNote: 'Book late October to November, after most leaves drop.',
    headline: 'Leaves gone before the snow flies',
    promise: 'Leaves cleared from lawns, beds and hard surfaces, then hauled away.',
    summary: 'Fall leaf removal from lawns, beds, patios and driveways, with haul-away.',
    outcomeLabel: 'Clear my leaves',
    bullets: ['Lawn, beds and patios', 'Haul-away included', 'One visit or two'],
    heroImageLabel: 'Leaves being blown into a tarp on a front lawn',
    problem:
      'Leaves left on the lawn over winter smother the grass and cause mold and bare patches in spring. Wet leaves on walkways are slippery.',
    benefits: [
      { title: 'Protects your lawn', body: 'Grass gets light and air through the winter.' },
      { title: 'Safer walkways', body: 'No slippery wet leaves on steps and paths.' },
      { title: 'Fast', body: 'Most yards are done in a few hours.' },
    ],
    included: [
      'Leaves blown and raked from lawn and beds',
      'Patios, walks and driveway cleared',
      'Haul-away of all leaves',
    ],
    method:
      'We blow leaves out of beds and off hard surfaces, rake them into tarps and load them for disposal. Two visits (early and late fall) work well for yards with big trees.',
    process: [
      { title: 'Get a price', body: 'Tell us the yard size.' },
      { title: 'Blow and rake', body: 'Leaves gathered from every area.' },
      { title: 'Load', body: 'Leaves tarped and loaded.' },
      { title: 'Haul', body: 'Taken away for composting where possible.' },
    ],
    priceFactors: ['Yard size', 'Volume of leaves', 'Number of visits'],
    faqs: [
      {
        question: 'One visit or two?',
        answer:
          'One late visit works for most yards. Yards with big trees often need an early and a late visit.',
      },
      {
        question: 'Do you clean gutters too?',
        answer: 'Add gutter cleaning and we’ll do both in one trip.',
      },
      {
        question: 'Can I keep leaves for compost?',
        answer: 'Yes. Tell us where to pile them.',
      },
      {
        question: 'What if it snows early?',
        answer: 'We’ll come back once it melts if the leaves are buried.',
      },
      {
        question: 'Do you mulch leaves into the lawn?',
        answer: 'For light leaf cover, mulching is an option. Heavy cover should be removed.',
      },
    ],
    related: ['yard-cleanup', 'gutter-cleaning', 'garden-bed-cleanup'],
    questions: [yardSize, ask.yesNo('haul_away', 'Haul the leaves away?')],
  },
  {
    slug: 'garden-bed-cleanup',
    title: 'Garden & Bed Cleanup',
    category: 'yard-care',
    icon: 'flower',
    quoteMode: 'custom',
    seasons: ['spring', 'fall'],
    headline: 'Garden beds that look cared for',
    promise: 'Weeding, cutting back, edging and fresh mulch for tired beds.',
    summary:
      'Garden bed cleanup: weeding, cutting back, edging and mulching, quoted from your photos.',
    outcomeLabel: 'Get a bed cleanup quote',
    bullets: ['Weeding and cutting back', 'Crisp edges', 'Fresh mulch available'],
    heroImageLabel: 'Garden bed with fresh mulch and crisp edges',
    problem:
      'Weeds move in fast, edges blur into the lawn and dead growth piles up. Beds are often the first thing that makes a yard look neglected.',
    benefits: [
      { title: 'Fewer weeds', body: 'Weeds pulled by the root and beds mulched to slow regrowth.' },
      { title: 'Defined edges', body: 'Crisp edges make the whole yard look sharper.' },
      { title: 'Healthier plants', body: 'Less competition for water and nutrients.' },
    ],
    included: [
      'Weeding by hand',
      'Cutting back dead growth',
      'Bed edging',
      'Mulch (if selected)',
      'Debris removal',
    ],
    method:
      'We pull weeds by hand, cut back dead or overgrown plants, re-cut edges and top with mulch if you choose. We quote from photos since every garden is different.',
    process: [
      { title: 'Send photos', body: 'Show us the beds and tell us roughly how many.' },
      { title: 'Get a quote', body: 'With or without mulch.' },
      { title: 'Clean up', body: 'Weed, cut back and edge.' },
      { title: 'Finish', body: 'Mulch and haul debris.' },
    ],
    priceFactors: ['Bed count and size', 'Weed level', 'Mulch'],
    faqs: [
      {
        question: 'Do you supply mulch?',
        answer: 'Yes, or we can spread mulch you’ve bought.',
      },
      {
        question: 'Can you plant flowers too?',
        answer: 'Simple planting can be added. Larger landscape design is outside what we offer.',
      },
      {
        question: 'Do you use weed killer?',
        answer: 'We weed by hand. Ask if you’d like a pre-emergent treatment.',
      },
      {
        question: 'How often should beds be cleaned up?',
        answer: 'Spring and fall for most homes, with light weeding in summer.',
      },
      {
        question: 'Can you work around delicate plants?',
        answer: 'Yes. Point out anything special before we start.',
      },
    ],
    related: ['yard-cleanup', 'leaf-removal', 'minor-exterior-repairs'],
  },
  {
    slug: 'garbage-bin-cleaning',
    title: 'Garbage Bin Cleaning',
    category: 'yard-care',
    icon: 'trash',
    quoteMode: 'subscription',
    seasons: ['all-year'],
    headline: 'Bins that don’t smell',
    promise: 'Washed, sanitized and deodorized bins on a schedule that suits you.',
    summary:
      'Garbage, recycling and compost bin cleaning on a recurring schedule, right after pickup day.',
    outcomeLabel: 'Start bin cleaning',
    bullets: ['Washed and sanitized', 'Right after pickup day', 'Monthly or quarterly'],
    heroImageLabel: 'Freshly washed trash and recycling bins at the curb',
    problem:
      'Bins collect residue that smells, attracts flies and pests, and grows bacteria, especially in summer. Washing them yourself is unpleasant and sends dirty water into your yard.',
    benefits: [
      { title: 'No more smell', body: 'Washed, sanitized and deodorized.' },
      { title: 'Fewer pests', body: 'Clean bins attract fewer flies, raccoons and rodents.' },
      { title: 'Set and forget', body: 'We come after pickup day on your schedule.' },
    ],
    included: [
      'Inside and outside wash',
      'Sanitizing rinse',
      'Deodorizer',
      'Bins returned to their spot',
    ],
    method:
      'We visit on your pickup day after the trucks have emptied the bins. Bins are washed inside and out with hot water, sanitized and deodorized. Wash water is collected, not dumped in your yard.',
    process: [
      { title: 'Sign up', body: 'Choose how many bins and how often.' },
      { title: 'Pickup day', body: 'We come after the trucks.' },
      { title: 'Wash', body: 'Inside, outside and sanitized.' },
      { title: 'Repeat', body: 'Same schedule, all year.' },
    ],
    priceFactors: ['Number of bins', 'Frequency'],
    faqs: [
      {
        question: 'Do I need to be home?',
        answer: 'No. Just leave the bins at the curb after pickup.',
      },
      {
        question: 'Where does the dirty water go?',
        answer: 'We collect it and dispose of it properly, not in your yard or the storm drain.',
      },
      {
        question: 'How often should bins be cleaned?',
        answer: 'Monthly in summer works well. Quarterly is enough for most of the year.',
      },
      {
        question: 'Can I pause in winter?',
        answer: 'Yes. Many customers pause in the coldest months.',
      },
      {
        question: 'Do you clean recycling and compost bins?',
        answer: 'Yes, any curbside bin.',
      },
    ],
    related: ['garage-driveway-pressure-cleaning', 'yard-cleanup', 'pressure-washing'],
    questions: [ask.number('bins', 'How many bins?', { min: 1, max: 6, unit: 'bins' })],
  },
  {
    slug: 'exterior-caulking',
    title: 'Exterior Caulking',
    category: 'yard-care',
    icon: 'brush',
    quoteMode: 'custom',
    seasons: ['spring', 'summer', 'fall'],
    bookingWindowNote: 'Caulk needs mild, dry weather. We book spring through fall.',
    headline: 'Seal out drafts and water',
    promise: 'Fresh caulking around windows, doors and trim.',
    summary:
      'Exterior caulking for windows, doors, trim and siding gaps to keep out water, drafts and pests.',
    outcomeLabel: 'Get a caulking quote',
    bullets: ['Windows, doors and trim', 'Old caulk removed first', 'Paintable or clear'],
    heroImageLabel: 'Technician applying a clean bead of caulk around a window frame',
    problem:
      'Exterior caulk dries out and cracks in sun and freeze-thaw cycles. Gaps let in water, drafts and insects, and water behind trim leads to rot.',
    benefits: [
      { title: 'Stops leaks', body: 'Water stays out of walls and trim.' },
      { title: 'Fewer drafts', body: 'Helps with comfort and energy bills.' },
      { title: 'Prevents rot', body: 'Protects wood trim and siding.' },
    ],
    included: [
      'Removal of failed caulk',
      'Surface cleaning',
      'New exterior-grade caulk',
      'Clean, smooth bead',
    ],
    method:
      'We cut out cracked caulk, clean the joint and apply exterior-grade sealant suited to the surface. Joints are tooled smooth for a neat finish.',
    process: [
      { title: 'Send photos', body: 'Tell us how many windows and doors.' },
      { title: 'Get a quote', body: 'Priced by openings and condition.' },
      { title: 'Remove and prep', body: 'Old caulk out, joints cleaned.' },
      { title: 'Seal', body: 'New caulk applied and tooled.' },
    ],
    priceFactors: ['Number of windows and doors', 'Height', 'Amount of old caulk to remove'],
    faqs: [
      {
        question: 'How often should exterior caulk be redone?',
        answer: 'Every five to ten years, or whenever you see cracks or gaps.',
      },
      {
        question: 'Can it be painted?',
        answer: 'Yes. We use paintable caulk where needed.',
      },
      {
        question: 'Do you caulk inside too?',
        answer: 'Yes, as part of general property maintenance.',
      },
      {
        question: 'Will it fix a leaking window?',
        answer:
          'Caulking fixes many leaks around frames. Leaks through the window itself need a window specialist.',
      },
      {
        question: 'What weather do you need?',
        answer: 'Dry days above about 40°F.',
      },
    ],
    related: ['minor-exterior-repairs', 'exterior-painting', 'window-cleaning'],
  },
  {
    slug: 'minor-exterior-repairs',
    title: 'Minor Exterior Repairs',
    category: 'yard-care',
    icon: 'hammer',
    quoteMode: 'custom',
    seasons: ['all-year'],
    headline: 'Small fixes before they become big ones',
    promise: 'Loose boards, gutter brackets, fence pickets and other small exterior repairs.',
    summary:
      'Minor exterior repairs: fence pickets, loose trim, gutter brackets, downspouts, siding pieces and more.',
    outcomeLabel: 'Get a repair quote',
    bullets: ['Fences, trim and gutters', 'Quoted from photos', 'Combine with cleaning'],
    heroImageLabel: 'Technician replacing a broken fence picket',
    problem:
      'A loose gutter bracket, a broken fence picket or a detached downspout looks small, but left alone it can lead to water damage or a bigger repair.',
    benefits: [
      { title: 'Catch problems early', body: 'Small fixes prevent bigger repairs.' },
      { title: 'One trip', body: 'Combine repairs with a cleaning visit.' },
      { title: 'Quoted from photos', body: 'Usually no visit needed to price it.' },
    ],
    included: [
      'Repair as quoted',
      'Materials (at cost or provided)',
      'Clean-up of the work area',
      'Photos when done',
    ],
    method:
      'Send photos and a short description. We confirm what’s needed, bring the parts and fix it in one visit where we can. We take on carpentry-level fixes and refer licensed trades for anything bigger.',
    process: [
      { title: 'Send photos', body: 'Show us what needs fixing.' },
      { title: 'Get a quote', body: 'Labor and materials.' },
      { title: 'Repair', body: 'We bring the parts and fix it.' },
      { title: 'Confirm', body: 'Photos when done.' },
    ],
    priceFactors: ['Type of repair', 'Materials', 'Height and access'],
    faqs: [
      {
        question: 'What kinds of repairs do you do?',
        answer:
          'Fence pickets and gates, trim boards, gutter brackets, downspouts, loose siding pieces, deck boards and similar.',
      },
      {
        question: 'Do you do roofing?',
        answer:
          'No. Roof repairs go to a licensed roofer. We can point out damage we see while cleaning.',
      },
      {
        question: 'Do you supply materials?',
        answer: 'Yes, at cost, or we use what you provide.',
      },
      {
        question: 'Can you match my siding?',
        answer: 'We’ll try. Older siding can be hard to match exactly.',
      },
      {
        question: 'Is there a minimum charge?',
        answer: 'Yes, each visit has a minimum, so grouping repairs is good value.',
      },
    ],
    related: ['exterior-caulking', 'property-maintenance', 'fence-deck-staining'],
  },
  {
    slug: 'fence-deck-staining',
    title: 'Fence & Deck Staining',
    category: 'yard-care',
    icon: 'roller',
    quoteMode: 'instant',
    seasons: ['summer'],
    bookingWindowNote: 'Staining needs warm, dry weather. We book June through September.',
    headline: 'Rich color that protects the wood',
    promise: 'Fences and decks cleaned, prepped and stained to last.',
    summary:
      'Fence and deck staining, including cleaning and prep, in transparent, semi-transparent or solid stain.',
    outcomeLabel: 'Refresh my wood',
    bullets: [
      'Cleaned and prepped first',
      'Your choice of stain',
      'Protects against sun and water',
    ],
    heroImageLabel: 'Freshly stained cedar fence with rich color',
    problem:
      'Sun and water break down bare and old-stained wood. It turns gray, splits and starts to rot. Stain protects it, but only if the wood is clean and dry first.',
    benefits: [
      { title: 'Protects wood', body: 'Blocks UV and water to slow graying, splitting and rot.' },
      { title: 'Even, rich color', body: 'Proper prep means stain soaks in evenly.' },
      { title: 'Lasts longer', body: 'A clean surface helps stain last for years.' },
    ],
    included: [
      'Cleaning and brightening (if not done recently)',
      'Masking of nearby surfaces',
      'Stain applied by brush and sprayer',
      'Clean-up',
    ],
    method:
      'Staining starts with a clean, dry surface, so we wash and brighten the wood if needed and let it dry for at least 48 hours. Then we mask nearby surfaces and apply stain with a sprayer, back-brushing so it soaks in.',
    safety:
      'We mask siding, plants and hardscape and stain only in dry weather with no rain in the forecast.',
    process: [
      { title: 'Get a price', body: 'Tell us the project, size and condition.' },
      { title: 'Choose a stain', body: 'Transparent, semi-transparent or solid.' },
      { title: 'Prep', body: 'Clean, dry and mask.' },
      { title: 'Stain', body: 'Spray and back-brush for an even finish.' },
    ],
    priceFactors: ['Size', 'Fence or deck', 'Condition of the wood', 'Stain type'],
    faqs: [
      {
        question: 'How long does stain last?',
        answer:
          'Transparent stains last one to two years, semi-transparent two to three, solid three to five, depending on sun.',
      },
      {
        question: 'Do I need cleaning first?',
        answer:
          'Yes. We include cleaning if the wood hasn’t been cleaned recently, or bundle it with fence or deck cleaning.',
      },
      {
        question: 'Can you stain composite decks?',
        answer: 'Most composite isn’t meant to be stained. We’ll clean it instead.',
      },
      {
        question: 'When can I use my deck?',
        answer: 'Light foot traffic after about 24 hours, furniture after 48.',
      },
      {
        question: 'Do you supply the stain?',
        answer: 'Yes. We’ll show you color samples first.',
      },
    ],
    related: ['fence-cleaning', 'deck-cleaning', 'exterior-painting'],
    questions: [
      ask.select('project', 'What are we staining?', ['Deck', 'Fence']),
      ask.number('size', 'Approximate size', {
        min: 20,
        max: 5000,
        unit: 'sq ft or linear ft',
        helpText: 'Square feet for decks, linear feet for fences.',
      }),
      ask.select('condition', 'Condition of the wood', [
        'Good',
        'Weathered and gray',
        'Peeling old stain',
      ]),
    ],
  },
  {
    slug: 'exterior-painting',
    title: 'Exterior Painting',
    category: 'yard-care',
    icon: 'paintbrush',
    quoteMode: 'custom',
    siteVisit: true,
    seasons: ['summer'],
    bookingWindowNote:
      'Exterior painting runs late spring to early fall. Quotes need a site visit.',
    headline: 'A fresh coat, done properly',
    promise: 'Exterior painting with the prep that makes paint last.',
    summary: 'Exterior painting for siding, trim, doors and fences, quoted after a site visit.',
    outcomeLabel: 'Book a painting visit',
    bullets: ['Siding, trim and doors', 'Washing and prep included', 'Quoted on site'],
    heroImageLabel: 'Painter rolling fresh color onto wood siding',
    problem:
      'Peeling and fading paint lets water into wood and makes a home look tired. Paint over a dirty or flaking surface fails quickly.',
    benefits: [
      { title: 'Protects your home', body: 'Fresh paint seals siding and trim against water.' },
      { title: 'Prep done right', body: 'Washing, scraping and caulking come first.' },
      { title: 'Big curb appeal', body: 'A new color or a refresh makes the home look new.' },
    ],
    included: [
      'Site visit and written quote',
      'Washing and scraping',
      'Caulking and spot priming',
      'Two coats where needed',
      'Clean-up',
    ],
    method:
      'We wash the surface, scrape loose paint, caulk gaps and prime bare spots. Then we apply quality exterior paint by brush, roller or sprayer, depending on the surface.',
    process: [
      { title: 'Book a visit', body: 'Send photos and pick a time for a site visit.' },
      { title: 'Quote', body: 'Written quote with scope and color plan.' },
      { title: 'Prep', body: 'Wash, scrape, caulk and prime.' },
      { title: 'Paint', body: 'Paint, inspect and clean up.' },
    ],
    priceFactors: ['Size and stories', 'Amount of prep', 'Number of colors', 'Access'],
    faqs: [
      {
        question: 'Why do you need a site visit?',
        answer:
          'Prep is most of the work in painting, and we need to see the condition to quote fairly.',
      },
      {
        question: 'Do you test for lead paint?',
        answer:
          'Homes built before 1978 may have lead paint. We’ll discuss testing and safe-work practices at the visit.',
      },
      {
        question: 'Can you help choose colors?',
        answer: 'We can bring samples and paint test patches.',
      },
      {
        question: 'How long does it take?',
        answer: 'Most homes take several days, depending on size, prep and weather.',
      },
      {
        question: 'Do you paint fences and decks?',
        answer: 'Yes. For wood that’s been stained before, staining may be the better choice.',
      },
    ],
    related: ['exterior-caulking', 'house-washing', 'fence-deck-staining'],
  },
  {
    slug: 'garage-driveway-pressure-cleaning',
    title: 'Garage & Driveway Pressure Cleaning',
    category: 'yard-care',
    icon: 'car',
    quoteMode: 'instant',
    seasons: ['all-year'],
    headline: 'Oil stains and tire marks, gone',
    promise: 'Garage floor and driveway cleaned together in one visit.',
    summary:
      'Pressure cleaning for the garage floor and driveway together, focused on oil stains, tire marks and winter salt.',
    outcomeLabel: 'Clean my garage floor',
    bullets: ['Garage floor and driveway', 'Oil and tire marks', 'Salt residue after winter'],
    heroImageLabel: 'Garage floor with oil stain treated, next to a cleaned driveway',
    problem:
      'Garage floors collect oil drips, tire marks and salty slush tracked in all winter. Salt left on concrete keeps eating at the surface.',
    benefits: [
      { title: 'One visit', body: 'Garage floor and driveway done together.' },
      { title: 'Salt removed', body: 'Washing off salt slows concrete damage.' },
      { title: 'Cleaner home', body: 'Less dirt tracked from the garage into the house.' },
    ],
    included: [
      'Garage floor swept and cleared',
      'Degreaser on oil stains',
      'Surface cleaner on garage and driveway',
      'Water directed out of the garage',
    ],
    method:
      'We sweep the garage, treat oil and tire marks with degreaser, then use a surface cleaner on the garage floor and driveway. Water is pushed out of the garage so nothing pools inside.',
    process: [
      { title: 'Get a price', body: 'Tell us the garage size and driveway area.' },
      { title: 'Clear', body: 'Move cars and items off the floor.' },
      { title: 'Treat and clean', body: 'Degreaser, then surface cleaner.' },
      { title: 'Dry out', body: 'Water squeegeed out and the doors left open to dry.' },
    ],
    priceFactors: ['Garage size', 'Driveway area', 'Oil stains'],
    faqs: [
      {
        question: 'Do I need to empty the garage?',
        answer: 'Clear the floor so we can reach it. Shelving can stay.',
      },
      {
        question: 'Will water get on my stored items?',
        answer: 'We control the spray and squeegee water out. Lift anything sitting on the floor.',
      },
      {
        question: 'Can you remove epoxy-coated floor stains?',
        answer: 'We clean epoxy floors gently. Stains inside the coating can’t be removed.',
      },
      {
        question: 'How is this different from driveway cleaning?',
        answer:
          'Driveway cleaning is the driveway only. This adds the garage floor and focuses on oil and salt.',
      },
      {
        question: 'Can you do it in winter?',
        answer: 'On days above freezing, yes. It’s a great way to remove salt mid-season.',
      },
    ],
    related: ['driveway-cleaning', 'garage-cleaning', 'pressure-washing'],
    questions: [
      garageSize,
      ask.number('driveway_area', 'Driveway size', {
        min: 0,
        max: 10000,
        unit: 'sq ft',
        helpText: 'One car space is about 200 sq ft.',
      }),
      ask.yesNo('oil_stains', 'Oil stains to treat?'),
    ],
  },
]
