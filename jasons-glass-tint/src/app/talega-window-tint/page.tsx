import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Window Tinting Talega, CA | Jason's Glass Tint — San Clemente",
  description: "Premium residential and automotive window tinting for Talega homeowners. Reduce heat, block UV, protect interiors. Jason personally installs every project. Call (949) 496-8468.",
  openGraph: {
    title: "Window Tinting Talega, CA | Jason's Glass Tint",
    description: "Serving Talega since 1989. Premium home and automotive tinting by Jason himself. No subcontractors, honest pricing.",
    url: 'https://jasonsglasstint.com/talega-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/talega-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Talega, California",
        headline: "Window Tinting in Talega",
        sub:      "Talega's hillside homes enjoy stunning views and year-round California sunshine. Premium window film protects those homes from UV damage, excessive heat, and energy loss — without affecting the aesthetic or the views.",
        img:      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80",
        slot:     'talegaPageHero',
      }}
      intro="Talega is one of San Clemente's most sought-after communities — and one of Jason's most consistent service areas. Hillside exposure and large windows are beautiful, but they come with heat and UV challenges that premium window film solves elegantly."
      sections={[
        {
          heading: "Residential Tinting for Talega's Premier Homes",
          body: "Talega's master-planned community features larger-than-average homes, high ceilings, and expansive windows designed to maximize views and natural light. Those same design features, however, create heat gain and UV exposure that drives up cooling costs and damages interiors. Jason regularly serves Talega homeowners seeking to reduce afternoon heat in west-facing living areas, protect hardwood floors and high-end furniture from UV fading, and lower energy bills during Orange County's warm months. The solution is always the same: professional-grade solar control film that blocks heat and UV while preserving the open, bright feel that makes Talega homes desirable.",
        },
        {
          heading: "HOA Compliance and Exterior Aesthetics",
          body: "Talega is an HOA community, and exterior modifications — including window film — are subject to approval guidelines. Jason is familiar with the Talega HOA requirements and installs film that meets both performance goals and exterior appearance standards. Professional window film from 3M and Llumar is designed to present a clean, neutral exterior appearance that is indistinguishable from standard glass in most community assessments. Jason can advise on film options that are most likely to be HOA-compliant based on his experience in the community.",
        },
        {
          heading: "Automotive Tinting for Talega Residents",
          body: "While residential tinting is the primary request in Talega, automotive work is equally common. Talega residents with premium vehicles — SUVs, sports cars, luxury sedans — regularly turn to Jason for ceramic film installs that provide heat rejection and UV protection on their vehicles. Jason's home base in San Clemente means Talega is an easy service area for both residential and automotive projects.",
        },
      ]}
      benefits={[
        'Serving Talega homeowners since 1989',
        'Experience with Talega HOA aesthetic requirements',
        'Solar control film for large-windowed hillside homes',
        'Protect premium interiors from UV fade',
        'Reduce cooling costs significantly',
        'Automotive and residential in one call',
        'Jason personally handles every Talega install',
      ]}
      faqs={[
        {
          q: 'Does window tinting in Talega require HOA approval?',
          a: "Talega has HOA guidelines for exterior modifications. Jason recommends discussing your tinting plans with your HOA before installation. He installs professional-grade film that presents a neutral, attractive exterior appearance consistent with most community standards.",
        },
        {
          q: 'Does window film affect natural light in my Talega home?',
          a: "Quality solar control film maintains high visible light transmission — typically 40–75% depending on the film selected. The interior remains bright and open; you simply don't get the heat and UV that comes with it.",
        },
        {
          q: 'Can Jason do both my home and my cars in Talega?',
          a: "Yes. Many Talega clients have Jason tint their vehicles and their home windows. He can typically coordinate both on the same visit for larger properties.",
        },
      ]}
      relatedLinks={[
        { label: 'San Clemente Tint',  href: '/san-clemente-window-tint' },
        { label: 'Residential Tint',   href: '/residential-window-tint'  },
        { label: 'Automotive Tint',    href: '/automotive-window-tint'   },
        { label: 'Dana Point Tint',    href: '/dana-point-window-tint'   },
      ]}
    />
  );
}
