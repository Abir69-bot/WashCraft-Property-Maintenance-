import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    // Custom type-scale utilities from globals.css, so they don't clash with text colours.
    classGroups: { 'font-size': [{ text: ['h1', 'h2', 'h3', 'body', 'small'] }] },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
