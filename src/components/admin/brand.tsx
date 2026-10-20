import Image from 'next/image'

import icon from '@/app/(site)/icon.png'
import logo from '@/assets/brand/washcraft-logo.png'

/** Logo on the admin login and "create first user" screens. */
export function AdminLogo() {
  return <Image src={logo} alt="WashCraft Property Maintenance" height={180} width={193} priority />
}

/** Small mark in the admin navigation. */
export function AdminIcon() {
  return <Image src={icon} alt="WashCraft" width={28} height={28} />
}
