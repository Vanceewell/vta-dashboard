import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Window Tinting San Clemente | Jason's Glass Tint — Since 1989",
  description: "San Clemente's most trusted window tint installer since 1989. Jason personally installs every job — automotive, residential, commercial, and marine tinting. Call (949) 496-8468.",
  openGraph: {
    title: "Window Tinting San Clemente | Jason's Glass Tint",
    description: "40+ years of window film installation in San Clemente. Jason personally installs every project. No subcontractors. Premium film. Honest pricing.",
    url: 'https://jasonsglasstint.com/san-clemente-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/san-clemente-window-tint' },
};

const faqSchema = {
  '@context':   'https://schema.org',
  '@type':      'FAQPage',
  mainEntity: [
    {
      '@type':          'Question',
      name:             'Does Jason install tint himself or does he use subcontractors?',
      acceptedAnswer: { '@type': 'Answer', text: 'Jason personally installs every single job. He has no employees and uses no subcontractors. The person you talk to on the phone is the person who shows up and does the work.' },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <LandingPageTemplate
        hero={{
          label:    "San Clemente, California",
          headline: "Window Tinting in San Clemente",
          sub:      "Jason's Glass Tint has served San Clemente since 1989. Over 40 years of professional film installation — automotive, residential, commercial, and marine — all personally installed by Jason.",
          img:      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80",
        }}
        intro="San Clemente has been Jason's home and his primary service area for over four decades. He's tinted windows on everything from daily commuters to oceanfront estates — and he's built his reputation one clean install at a time."
        sections={[
          {
            heading: "San Clemente's Trusted Tint Installer",
            body: "Window tinting in San Clemente is more than a service — it's a necessity. The coastal sun in South Orange County is intense year-round, and without quality film, vehicles and homes suffer from UV damage, excess heat, and privacy concerns. Jason's Glass Tint has been the solution for San Clemente residents since 1989. In a town where reputation matters and word of mouth still drives business, Jason has built a name based entirely on results. No advertising gimmicks, no rotating crews — just decades of exceptional work and a deep commitment to the community he calls home.",
          },
          {
            heading: "All Types of Window Tinting in San Clemente",
            body: "San Clemente clients bring Jason every kind of tinting project. Automotive tint is the most common — from standard sedans and pickup trucks to high-end Porsches and McLarens. Residential tinting is in high demand for ocean-facing homes where afternoon sun creates uncomfortable heat and UV damage to interior furnishings. Commercial clients on El Camino Real and throughout downtown San Clemente have turned to Jason for energy-efficient solar control film and privacy solutions. And for clients with vessels at Dana Point Harbor or San Clemente's waterfront, Jason offers premium marine-grade film designed for the coastal environment.",
          },
          {
            heading: "Why San Clemente Chooses Jason",
            body: "The difference between Jason's Glass Tint and a national chain or large shop comes down to one thing: personal accountability. When you call Jason, you're speaking with the installer. When he quotes you a price, that's the price you pay. When he shows up, it's him — not someone else. Over 40 years, Jason has earned the trust of thousands of San Clemente residents, and that trust is the foundation of everything. Many of his current clients have been coming back since the 1990s, and now their adult children bring their own vehicles to Jason. That kind of loyalty doesn't happen by accident.",
          },
        ]}
        benefits={[
          '40+ years serving San Clemente exclusively',
          'Jason personally installs every project',
          'No subcontractors, no crew turnover',
          'Premium film brands only — 3M, Llumar, Huper Optik',
          'Transparent pricing with no hidden fees',
          'Manufacturer warranty on all installed film',
          'Automotive, residential, commercial, and marine',
        ]}
        faqs={[
          {
            q: "What type of window film does Jason use?",
            a: "Jason installs only professional-grade film from manufacturers including 3M, Llumar, and Huper Optik. He does not stock or install bargain-bin film. The right film for your project depends on your goals — heat rejection, UV protection, privacy, or aesthetics — and Jason will walk you through the options.",
          },
          {
            q: "How long does automotive window tinting take?",
            a: "Most standard automotive installs take between 2 and 4 hours, depending on the vehicle and number of windows. More complex vehicles with curved rear windows may take longer. Jason does not rush installations — quality takes the time it takes.",
          },
          {
            q: "Does Jason offer residential window tinting in San Clemente?",
            a: "Yes. Residential tinting is one of Jason's most requested services in San Clemente, especially for homes with west-facing windows and ocean views. Film options include solar control (heat and UV reduction), privacy film, and decorative frost film.",
          },
        ]}
        relatedLinks={[
          { label: 'Automotive Tint',    href: '/automotive-window-tint'  },
          { label: 'Residential Tint',   href: '/residential-window-tint' },
          { label: 'Commercial Tint',    href: '/commercial-window-tint'  },
          { label: 'Talega Window Tint', href: '/talega-window-tint'      },
          { label: 'Dana Point Tint',    href: '/dana-point-window-tint'  },
        ]}
      />
    </>
  );
}
