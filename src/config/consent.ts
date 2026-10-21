/**
 * Marketing consent wording, by country (brief §11). The exact text a customer agreed to is
 * stored on their lead. Have the owner's counsel review before launch.
 */
export function consentText(country: string, company: string): string {
  if (country === 'CA') {
    return `Yes, ${company} may contact me by phone, text and email about my request and occasional offers. I can unsubscribe at any time.`
  }
  // US: TCPA-style express written consent for calls and texts.
  return `I agree to receive calls and texts from ${company} about my request and occasional offers at the number above, including by automated means. Consent is not a condition of purchase. Msg & data rates may apply. Reply STOP to opt out.`
}
