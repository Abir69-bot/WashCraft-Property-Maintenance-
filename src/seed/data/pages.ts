/**
 * Starter copy for the About, Careers and Legal pages. No business facts are invented: the
 * story, community involvement, certificates and staff benefits are left for the owner, and
 * every section without content is hidden. The legal text describes how this website actually
 * works and is listed in CONTENT_TODO.md for review before launch.
 */

export const aboutPage = {
  headline: 'One team for every season',
  intro:
    'WashCraft looks after homes and businesses across {region}: exterior and interior cleaning, snow and ice, holiday lighting and yard care, all from one team you can call all year.',
  heroImageLabel: 'The WashCraft crew in front of a freshly washed home',
  mission:
    'To keep {region} homes and businesses clean, safe and cared for in every season, with clear prices and careful work.',
  values: [
    {
      title: 'Careful with your property',
      body: 'We match the method to the surface, protect plants and fixtures, and check the work with you before we leave.',
    },
    {
      title: 'Clear prices',
      body: 'You see a price range before you book, and we agree the final price before any work starts.',
    },
    {
      title: 'Straight answers',
      body: 'If a job isn’t worth doing, or another service would suit you better, we’ll tell you.',
    },
    {
      title: 'Here all year',
      body: 'Washing and gutters in the warm months, snow and lights in winter: one team that knows your property.',
    },
  ],
}

export const careersPage = {
  headline: 'Work with WashCraft',
  intro:
    'We’re looking for reliable, careful people who like working outdoors and seeing a job done right. Tell us about yourself, even if there’s no open role that fits.',
  whyWorkHere: [
    {
      title: 'Work across the seasons',
      body: 'Washing, windows and gutters in the warm months, snow clearing and holiday lighting in winter.',
    },
    {
      title: 'Different every day',
      body: 'Homes, HOA communities and businesses across {region}, each with its own challenges.',
    },
    {
      title: 'Results you can see',
      body: 'Few jobs show the difference you made as clearly as a before-and-after.',
    },
  ],
}

const privacy = `
This policy explains what information this website collects, why, and what you can ask us to do with it. It applies to this website and to the quotes, bookings and messages that start here.

## What we collect

- **What you send us.** When you ask for a quote, book a service, contact us or apply for a job, we collect what you type in: usually your name, phone number, email address, address or postal code, details about your property and the job, and any photos or documents you upload.
- **Where you came from.** With a request we also record the page you landed on, the website that sent you (if any), campaign tags in the link (such as \`utm_source\`) and whether you used a phone, tablet or computer. This helps us understand which advertising works.
- **Analytics, only if you agree.** If you accept analytics cookies, Google Analytics and Microsoft Clarity record how visitors use the site, such as pages viewed and clicks. If you decline, these tools are not loaded. You can change your choice at any time with the "Cookie settings" link at the bottom of every page.
- **Security.** Cloudflare Turnstile checks that forms are sent by people rather than bots, and our servers keep short-lived technical logs (such as IP addresses) to protect the site.

## How we use it

We use your information to answer your request, prepare quotes, schedule and carry out work, and contact you about it. We use analytics, when you allow it, to improve the website. We do not sell your personal information.

## Texts and emails

If you tick the consent box on a form, you agree that we may call or text you about your request and occasionally about our services, including by automated means. Consent is not a condition of purchase, message and data rates may apply, and you can reply **STOP** to any text to opt out. Emails about your request are sent to the address you give us.

## Who helps us run the site

We use trusted service providers who process information for us: website hosting, our database, file storage, email and text-message delivery, spam protection and, with your consent, analytics. They may only use it to provide their service to us.

## How long we keep it

We keep requests and job records for as long as we need them to serve you and to keep proper business records, then delete them. Photos and documents you upload are kept privately and are only available to our staff.

## Your choices

You can ask us to see, correct or delete the personal information we hold about you, or to stop contacting you. Use the details on our Contact page and we will respond within a reasonable time.

## Children

This website is not meant for children under 13, and we do not knowingly collect their information.

## Changes

If we change this policy, we will update the date at the top of this page.
`

const terms = `
These terms apply to your use of this website. By using it, you agree to them.

## Quotes and prices

Prices shown on this website, including instant price ranges, are estimates based on the details you give us. They are not offers. We confirm the price after seeing photos or visiting, and we agree the final price with you before any work starts. Taxes may apply.

## Bookings and payment

Sending a form is a request, not a confirmed booking. We will contact you to confirm the date, the work and the price. We do not take payments on this website.

## Your information

What we do with the information you send us is explained in our Privacy policy.

## Photos and documents you upload

Only upload photos and documents of property you own or are authorized to share. We use them only to quote and plan your job.

## Content

We work to keep this website accurate and up to date, but service details, seasons and availability can change. The text, photos and design of this website belong to us, unless stated otherwise, and may not be copied without permission.

## Links to other websites

Links to other websites, such as review sites or maps, are provided for convenience. We are not responsible for their content.

## Liability

We provide this website as is. To the extent the law allows, we are not liable for losses caused by using it or by relying on estimates shown on it. Nothing in these terms limits rights you have under consumer protection law.

## Changes

We may update these terms. The date at the top of this page shows when they last changed.
`

const accessibility = `
We want everyone to be able to use this website, including people who use screen readers, keyboard navigation, voice control, zoom or other assistive technology.

## Our goal

We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.

## What we do

- Our page templates are checked with automated accessibility tests before every release.
- Pages work with a keyboard alone, with visible focus and a "Skip to main content" link.
- Forms have visible labels, and errors are explained next to the field they belong to.
- Photos have text descriptions, and text and buttons meet color-contrast guidelines.
- Moving content can be paused, and the site respects your device's reduced-motion setting.

## Known limitations

The service-area map shows the same cities that are listed in text next to it. Some older uploaded documents may not be fully accessible; ask us and we will provide the information another way.

## Need help or found a problem?

If anything on this website is hard to use, please tell us using the details on our Contact page. We will help you with your request in the meantime, by phone, text or email, whichever works best for you.
`

export const legalPages = { privacy, terms, accessibility }
