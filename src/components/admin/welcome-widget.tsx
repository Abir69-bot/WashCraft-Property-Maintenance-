import {
  CalendarRange,
  ExternalLink,
  House,
  ImagePlus,
  Inbox,
  MessageSquareQuote,
  NotebookPen,
  Settings,
  Tags,
} from 'lucide-react'
import Link from 'next/link'
import type { WidgetServerProps } from 'payload'

import { NEEDS_REPLY, leadsWithStatus, pricingToReview } from './lead-dashboard'

type Shortcut = { icon: React.ReactNode; title: string; hint: string; href: string }

/**
 * Welcome widget: a greeting, a link to the live site and shortcuts to the jobs the owner does
 * most (answer leads, change photos and copy, check prices), so nobody has to learn the menu first.
 */
export async function WelcomeWidget({ req, user }: WidgetServerProps) {
  if (!user) return null
  const { payload } = req
  const admin = payload.config.routes.admin
  const [waiting, toReview] = await Promise.all([
    payload.count({ collection: 'leads', where: { status: { in: NEEDS_REPLY } } }),
    pricingToReview(payload),
  ])
  const name = ('name' in user && typeof user.name === 'string' && user.name.trim()) || null
  const icon = 'wc-shortcut__icon'

  const shortcuts: Shortcut[] = [
    {
      icon: <Inbox aria-hidden className={icon} />,
      title: 'Answer leads',
      hint: waiting.totalDocs
        ? `${waiting.totalDocs} waiting for a reply`
        : 'Nobody is waiting right now',
      href: leadsWithStatus(admin, NEEDS_REPLY),
    },
    {
      icon: <House aria-hidden className={icon} />,
      title: 'Home page',
      hint: 'Hero, sections, comparison table',
      href: `${admin}/globals/homepage`,
    },
    {
      icon: <ImagePlus aria-hidden className={icon} />,
      title: 'Upload photos',
      hint: 'Job photos for any page',
      href: `${admin}/collections/media/create`,
    },
    {
      icon: <MessageSquareQuote aria-hidden className={icon} />,
      title: 'Add a review',
      hint: 'A customer testimonial',
      href: `${admin}/collections/testimonials/create`,
    },
    {
      icon: <NotebookPen aria-hidden className={icon} />,
      title: 'Write a blog post',
      hint: 'Tips and news for customers',
      href: `${admin}/collections/posts/create`,
    },
    {
      icon: <Tags aria-hidden className={icon} />,
      title: 'Check prices',
      hint: toReview ? `${toReview} still placeholders` : 'All prices reviewed',
      href: `${admin}/collections/pricing-rules`,
    },
    {
      icon: <CalendarRange aria-hidden className={icon} />,
      title: 'Seasons',
      hint: 'Dates, banner, featured hero',
      href: `${admin}/globals/seasonal-settings`,
    },
    {
      icon: <Settings aria-hidden className={icon} />,
      title: 'Business details',
      hint: 'Phone, hours, alerts, Google',
      href: `${admin}/globals/site-settings`,
    },
  ]

  return (
    <section className="wc-widget wc-welcome" aria-labelledby="wc-welcome-heading">
      <header className="wc-widget__head">
        <div>
          <h2 id="wc-welcome-heading">{name ? `Welcome back, ${name}` : 'Welcome back'}</h2>
          <p className="wc-muted">What would you like to do?</p>
        </div>
        <a href="/" target="_blank" rel="noopener" className="wc-button">
          View website <ExternalLink aria-hidden className="wc-button__icon" />
          <span className="wc-sr-only">(opens in a new tab)</span>
        </a>
      </header>
      <ul className="wc-shortcuts">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.title}>
            <Link href={shortcut.href} className="wc-shortcut">
              {shortcut.icon}
              <span>
                <span className="wc-shortcut__title">{shortcut.title}</span>
                <span className="wc-shortcut__hint">{shortcut.hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
