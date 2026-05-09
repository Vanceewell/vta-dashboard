import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Frost Film & Privacy Window Film | Jason's Glass Tint — San Clemente",
  description: "Professional frosted and privacy window film installation in San Clemente. Elegant, light-preserving privacy for homes and offices. Installed personally by Jason. Call (949) 496-8468.",
  openGraph: {
    title: "Frost Film & Privacy Window Film | Jason's Glass Tint",
    description: "Frosted privacy film for bathrooms, office glass, and residential windows. Natural light in, unwanted sightlines out. 40+ years of professional installation.",
    url: 'https://jasonsglasstint.com/frost-film',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/frost-film' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Frost & Privacy Film",
        headline: "Privacy Without Sacrificing Light",
        sub:      "Frosted and decorative privacy film transforms glass into an elegant privacy barrier — keeping natural light flowing while blocking unwanted sightlines. Installed personally by Jason throughout San Clemente and South Orange County.",
        img:      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
        slot:     'frostPageHero',
      }}
      intro="Privacy film is one of the most versatile and underutilized solutions in window film. It solves a common problem — the need for privacy without the cost, permanence, or light-blocking effect of window replacement, curtains, or frosted glass."
      sections={[
        {
          heading: "What Is Frost Film?",
          body: "Frost film is a professionally applied window film that mimics the appearance of etched or sandblasted glass — creating a soft, translucent surface that diffuses light beautifully while blocking clear sightlines. Unlike curtains or blinds, frost film allows natural light to pass through freely. Unlike frosted glass windows (which require full replacement), frost film is applied directly to your existing glass and can be removed without leaving residue. It's one of the most elegant, low-cost ways to change the character of a room or space.",
        },
        {
          heading: "Residential Applications",
          body: "Frost film is a natural fit for residential spaces where privacy and light coexist as competing priorities. Bathroom windows are the most common application — allowing natural light while preventing visibility from neighboring homes or streets. West-facing bedroom windows facing close neighbors benefit from privacy film that maintains the room's brightness without requiring window treatments. Front-door sidelights and transoms are frequently treated with frost film to balance curb appeal with entry privacy. Jason has installed privacy film throughout San Clemente, Talega, Dana Point, and surrounding neighborhoods where homes are built close together on hillside lots.",
        },
        {
          heading: "Commercial & Office Applications",
          body: "Office environments have their own privacy film requirements. Conference room glass partitions, HR offices, and executive suites often need visual privacy from open-plan floors without creating a sense of enclosure. Frost film on interior glass maintains the open feel of a modern workspace while creating functional private zones. For storefronts and commercial buildings, lower-section frost banding on street-facing windows is a popular aesthetic that provides privacy to working areas near windows. Medical clinics, dental offices, therapy practices, and professional services throughout South Orange County regularly use privacy film to meet patient confidentiality and professional appearance standards.",
        },
        {
          heading: "Decorative Frost Patterns",
          body: "Beyond solid frost, privacy film is available in a range of decorative patterns — frosted bands, geometric designs, gradient opacity, and custom configurations. A popular option for commercial spaces is a branded strip of frosted film at mid-window height that creates a professional, finished look. For residential applications, partial-frost options can preserve a clear view in one area of a window while applying privacy coverage where it matters most. Jason can discuss the options and recommend the right opacity and pattern for your specific situation.",
        },
      ]}
      benefits={[
        'Full privacy without blocking natural light',
        'No curtains, blinds, or window treatments required',
        'Clean, modern appearance for any room or office',
        'Ideal for bathroom windows, office partitions, and entry glass',
        'Applied to existing glass — no replacement needed',
        'Removable without residue or damage to glass',
        'Available in solid frost, gradient, and decorative patterns',
        'Installed personally by Jason — no subcontractors',
      ]}
      faqs={[
        {
          q: 'Can frost film be applied to only part of a window?',
          a: "Yes — partial application is common. A typical approach is frosting the lower portion of a window for privacy while leaving the upper portion clear for light and view. Jason will assess your specific window and recommend the right coverage zone for your privacy goals.",
        },
        {
          q: 'Does frost film block all visibility?',
          a: "Frost film significantly diffuses visibility — from outside, people cannot see clearly through the glass. However, it is not completely opaque. At very close range in bright light, silhouettes may be visible. For situations requiring complete opacity, blackout or one-way mirror film may be a better option. Jason will help you choose the right film for your specific privacy requirement.",
        },
        {
          q: 'Can frost film be removed later?',
          a: "Yes. Professionally installed frost film can be removed without damaging the glass. Unlike sandblasted or etched glass, film is a reversible solution — useful for renters or situations where future flexibility is important.",
        },
        {
          q: 'Does frost film work on interior glass partitions?',
          a: "Absolutely. Interior glass — office partitions, conference rooms, interior sidelights — is one of the most common applications for frost film. The installation process is the same as exterior glass, and the visual result is virtually identical to factory-frosted glass.",
        },
        {
          q: 'Does Jason install frost film on both residential and commercial projects?',
          a: "Yes. Jason installs frost and privacy film on homes, offices, medical clinics, retail storefronts, and any other type of commercial property throughout San Clemente, Dana Point, San Juan Capistrano, and the surrounding area.",
        },
      ]}
      relatedLinks={[
        { label: 'Residential Tint',  href: '/residential-window-tint'  },
        { label: 'Commercial Tint',   href: '/commercial-window-tint'   },
        { label: 'Safety Film',       href: '/safety-film'              },
        { label: 'San Clemente Tint', href: '/san-clemente-window-tint' },
      ]}
    />
  );
}
