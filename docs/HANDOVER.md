# Handover checklist

For the owner of WashCraft Property Maintenance (or whoever launches the site for them). Tick
each item before and just after launch. Setup steps are in the [README](../README.md); business
details still to supply are in [CONTENT_TODO.md](../CONTENT_TODO.md).

## 1. Accounts the business must own

Every account should be in the business's name, signed in with a business email address, with
two-factor authentication on, and with the password kept in a password manager the owner
controls. A developer can be invited as a member, but should not be the only owner.

| Service           | What it does                                    | Owner account | 2FA on | Notes |
| ----------------- | ----------------------------------------------- | ------------- | ------ | ----- |
| Domain registrar  | `washcraft.ca` (proposed: confirm it's bought)  | [ ]           | [ ]    |       |
| Vercel            | Hosts the website                               | [ ]           | [ ]    |       |
| Neon              | The database                                    | [ ]           | [ ]    |       |
| Cloudflare        | R2 file storage, Turnstile spam protection      | [ ]           | [ ]    |       |
| Resend            | Sends lead emails                               | [ ]           | [ ]    |       |
| Email host        | The business mailbox (e.g. `info@washcraft.ca`) | [ ]           | [ ]    |       |
| Twilio (optional) | Text alerts for new leads                       | [ ]           | [ ]    |       |
| GitHub            | The code and the weekly backup job              | [ ]           | [ ]    |       |
| Google (optional) | Search Console, Business Profile, Analytics     | [ ]           | [ ]    |       |

## 2. Domain and HTTPS

- [ ] The domain (`washcraft.ca` is proposed, not confirmed) is registered to the business, with
      auto-renew on and a payment card that won't expire soon. `.ca` domains need the registrant
      to meet CIRA's Canadian presence rules.
- [ ] DNS points at Vercel (Vercel → Project → Settings → Domains shows "Valid configuration")
      for both `washcraft.ca` and `www.washcraft.ca`, with one redirecting to the other.
- [ ] `https://` loads with a valid certificate, and `http://` redirects to `https://`.
- [ ] `NEXT_PUBLIC_SITE_URL` in Vercel is the final `https://` address; redeployed after setting
      it.
- [ ] `https://<domain>/sitemap.xml` and `/robots.txt` load, and the page source has no
      `noindex` on the live site.

## 3. Email

- [ ] The business mailbox exists and can send and receive. Only then enter it in Admin → Site
      settings → Email (the site shows no email address until it's set).
- [ ] Resend: the sending domain is verified (SPF and DKIM records added at the registrar), and
      `RESEND_API_KEY` and `EMAIL_FROM` are set in Vercel.
- [ ] Admin → Site settings → Lead alerts: the email addresses (and phone numbers, with Twilio)
      that should hear about new leads.
- [ ] Add a DMARC record (e.g. `v=DMARC1; p=none; rua=mailto:<your address>`) so lead emails
      aren't marked as spam.

## 4. Before going live

- [ ] `pnpm check-config` passes on the production settings (email, tagline confirmed, no demo
      values).
- [ ] Every published service is one the business offers, and its "Not included and access
      limits" list is accurate (CONTENT_TODO.md lists what still needs confirming).
- [ ] Only confirmed service areas are published (Admin → Cities).
- [ ] Phone number and hours entered only once confirmed (or left blank).
- [ ] "Quotes are free" ticked only if every quote is free.
- [ ] No insurance, licence or guarantee details unless they're current and can be shown.
- [ ] Privacy policy, terms and accessibility statement reviewed (ideally by a lawyer) and the
      business's legal name and contact added.
- [ ] Turnstile keys and the R2 buckets are set in Vercel (check-config lists anything missing).

## 5. Test a real enquiry (after deploying)

Integrations can only be proven with the real accounts, so do this on the live site:

- [ ] Send a quote request with a photo, using only an email address.
- [ ] The owner receives the lead email (and text, if Twilio is set) within a few minutes.
- [ ] The visitor receives the confirmation email.
- [ ] The lead shows in Admin → Leads, and its photo opens from the lead.
- [ ] Send one with only a phone number and a street address, and check it arrives too.
- [ ] Mark both test leads as spam or delete them.

## 6. Admin access

- [ ] The owner's admin account (the first user created on the live site) uses the business
      email and a strong, unique password.
- [ ] Staff accounts are created individually (Admin → Users), with the Staff role unless they
      need to change settings.
- [ ] Remove any developer or test accounts once launch is done, including `e2e@example.com` if
      it exists.

## 7. Renewal dates and running costs

Fill in once the accounts exist, and add the dates to the business calendar.

| Item                               | Renews on | Cost | Auto-renew | Card on file |
| ---------------------------------- | --------- | ---- | ---------- | ------------ |
| Domain (`.ca`)                     |           |      | [ ]        |              |
| Email hosting                      |           |      | [ ]        |              |
| Vercel plan                        |           |      | [ ]        |              |
| Neon plan                          |           |      | [ ]        |              |
| Cloudflare (R2)                    |           |      | [ ]        |              |
| Resend                             |           |      | [ ]        |              |
| Twilio number                      |           |      | [ ]        |              |
| Business insurance (if advertised) |           |      | [ ]        |              |

Free plans have limits: the admin dashboard warns at 80% of Neon's free storage.

## 8. Backups and recovery

- [ ] GitHub → Actions → **Weekly database backup** has run once successfully (run it by hand
      after launch). It keeps the newest 8 dumps in the private R2 bucket.
- [ ] Do one test restore into a new Neon branch (README → "Backups and restore") and check the
      services and leads are there.
- [ ] Site photos live in the public R2 bucket and aren't in the database dump; copy the bucket
      occasionally if you want a second copy.
- [ ] Leads that couldn't be saved during an outage are kept in the private bucket under
      `failed-leads/` and can be re-imported from the admin dashboard.

## 9. After launch

- [ ] Search Console: add the domain, verify it (DNS record) and submit the sitemap.
- [ ] Google Business Profile: create or claim it with the same name, phone and service areas as
      the site.
- [ ] Analytics stays off unless the owner wants it (README → "Analytics").
- [ ] Ask happy customers for honest Google reviews; the reviews page appears once real reviews
      exist.
