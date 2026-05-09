import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Automotive Window Tinting San Clemente | Jason's Glass Tint",
  description: "Professional automotive window tinting in San Clemente. Jason personally installs premium American-made film on all vehicle types. Call (949) 496-8468 for a quote.",
  openGraph: {
    title: "Automotive Window Tinting San Clemente | Jason's Glass Tint",
    description: "40+ years tinting cars, trucks, and SUVs in San Clemente. Premium American-made film, factory-precise installation by Jason himself.",
    url: 'https://jasonsglasstint.com/automotive-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/automotive-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Automotive Window Tinting",
        headline: "Car Window Tinting in San Clemente",
        sub:      "From daily drivers to high-end sports cars, Jason brings 40+ years of automotive tint experience to every install. Premium American-made film — all installed with factory precision.",
        img:      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80",
        slot:     'automotivePageHero',
      }}
      intro="Automotive window tinting is the most common request Jason receives — and also the one where quality of installation matters most. Factory-look tint on any vehicle isn't something you want to trust to a chain shop or a part-time installer."
      sections={[
        {
          heading: "Automotive Tinting That Looks Factory-Installed",
          body: "Jason has tinted tens of thousands of vehicles over his career — sedans, trucks, SUVs, coupes, convertibles, and high-performance sports cars. Every automotive tint install comes down to the same principles: the right film for the application, meticulous surface preparation, and patience during installation. Jason doesn't rush. He takes the time needed to ensure clean edges, no bubbles, no lifting, and a result that looks like the windows came from the factory tinted. From Porsches to Raptors, Teslas to Sprinter vans, San Clemente residents know where to go to get tint done right the first time.",
        },
        {
          heading: "Film Options for Every Automotive Need",
          body: "Not all window film is the same, and the right choice depends on your priorities. Jason works exclusively with premium American-made film — offering high heat rejection and maximum UV protection. The film is completely color-stable, meaning it won't purple or fade over time. Jason will walk you through all options and recommend the best fit for your vehicle and goals — without upselling you on something you don't need.",
        },
      ]}
      benefits={[
        'Jason installs every automotive tint himself — no subcontractors',
        'Premium American-made film options available for every budget and vehicle',
        'Factory-precise installation with no visible edges or bubbles',
        'Full compliance with California window tint laws',
        'All vehicle types: sedans, SUVs, trucks, sports cars, exotics',
        'Film brand: Madico Window Film',
        'Manufacturer warranty included',
      ]}
      faqs={[
        {
          q: 'How long does a car tint take?',
          a: 'Most standard installs take 2–4 hours. Vehicles with complex rear windows, multiple curves, or extra panels may take longer. Jason does not rush the process.',
        },
        {
          q: 'Can I wash my car right after tinting?',
          a: 'You should wait at least 3–5 days before washing the car and avoid rolling the windows down during this period. The film needs time to fully cure. Jason will give you specific care instructions for your install.',
        },
        {
          q: 'What kind of film does Jason use?',
          a: 'Jason installs premium American-made window film on every vehicle. The film provides high heat rejection, maximum UV protection (up to 99.9%), and no interference with GPS, cell phones, or EV charging systems. It is color-stable and built to last — it will not purple, fade, or peel over time.',
        },
        {
          q: 'Does Jason tint luxury and exotic vehicles?',
          a: "Yes. Jason regularly works on high-end vehicles including Porsche, BMW M-series, Maserati, McLaren, and others. He understands the precision required for these vehicles and approaches every high-end install with the care they deserve.",
        },
      ]}
      relatedLinks={[
        { label: 'San Clemente Tint',  href: '/san-clemente-window-tint'  },
        { label: 'Residential Tint',   href: '/residential-window-tint'   },
        { label: 'Marine Tint',        href: '/marine-window-tint'        },
        { label: 'Dana Point Tint',    href: '/dana-point-window-tint'    },
      ]}
    />
  );
}
