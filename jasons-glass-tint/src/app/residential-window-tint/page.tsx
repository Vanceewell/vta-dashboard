import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Residential Window Tinting San Clemente | Jason's Glass Tint",
  description: "Professional residential window tinting in San Clemente and South Orange County. Reduce heat, block UV, protect interiors, and lower energy costs. Call (949) 496-8468.",
  openGraph: {
    title: "Residential Window Tinting San Clemente | Jason's Glass Tint",
    description: "Premium home window tinting by Jason himself. Solar control, privacy film, and safety film for San Clemente homes and South Orange County.",
    url: 'https://jasonsglasstint.com/residential-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/residential-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Residential Window Tinting",
        headline: "Home Window Tinting in San Clemente",
        sub:      "Protect your home from coastal UV exposure, reduce cooling costs, and preserve your interior furnishings — without sacrificing the views that make South Orange County worth living in.",
        img:      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80",
        slot:     'residentialPageHero',
      }}
      intro="San Clemente's coastal location is a blessing and a challenge. The same sun that makes outdoor living spectacular also drives up cooling bills, fades hardwood floors and furniture, and can make a room uncomfortably hot. It also solves privacy issues. Quality residential window film solves many problems."
      sections={[
        {
          heading: "Residential Window Film for San Clemente Homes",
          body: "Jason has been installing residential window film throughout Orange County and San Clemente since 1989. He understands the specific challenges of coastal California homes — intense UV exposure year-round, glare off the Pacific on western exposures, and the need to preserve views while controlling heat. Whether you live in a Talega hillside home, a downtown San Clemente bungalow, or a Dana Point cliff-side property, the right window film can transform your indoor environment without even noticing the film is there.",
        },
        {
          heading: "Solar Control Film: Comfort and Energy Savings",
          body: "Solar control film is the most popular residential option Jason installs. It blocks up to 96% of solar heat and 99.9% of UV rays while maintaining excellent visible light transmission — meaning you still get natural light and views, just without the heat and UV damage. For homes in Talega and coastal San Clemente, this typically means 10–20% reduction in cooling costs and a dramatically more comfortable interior during the afternoon hours. Many homeowners report that rooms they previously avoided in summer become comfortable year-round after tinting.",
        },
        {
          heading: "UV Protection: Preserve Your Interior Investment",
          body: "UV radiation is the primary cause of fading in hardwood floors, carpets, upholstery, artwork, and window treatments. In San Clemente, where clear coastal skies mean UV exposure is consistent and intense, interior fade is a real problem. Professional residential window film blocks 99.9% of UV rays — the same type of UV protection built into museum display cases. For homeowners with high-end furnishings, custom cabinetry, or valuable artwork near windows, residential tinting is a straightforward investment in preservation.",
        },
      ]}
      benefits={[
        '99.9% UV ray blockage — protects floors, furniture, and artwork',
        'Up to 96% solar heat rejection for cooler interiors',
        'Reduce HVAC costs by 10–20% in summer months',
        'Maintain full visibility and natural light',
        'Privacy film options for bathrooms and street-facing windows',
        'Safety film available — holds glass together on impact',
        'Jason installs every residential project personally',
      ]}
      faqs={[
        {
          q: 'Will residential window tinting affect my view?',
          a: "No — quality solar control film is engineered to maintain high visible light transmission while blocking heat and UV. From the inside, the view is virtually unchanged. From the outside, the film gives a subtle, uniform appearance that many homeowners prefer to untreated glass.",
        },
        {
          q: 'Can I tint just a few windows instead of the whole house?',
          a: "Absolutely. Many San Clemente homeowners start with the most problematic windows — typically west-facing living areas and bedrooms — and expand later. Jason can prioritize based on where you're experiencing the most heat or UV issues.",
        },
        {
          q: 'Does residential window film work on dual-pane glass?',
          a: "Yes, with some considerations. Certain high-heat-rejection films can cause thermal stress in some dual-pane configurations. Jason will assess your specific windows and recommend a film that is safe and compatible. Most modern dual-pane windows are fully compatible with residential film.",
        },
      ]}
      benefitsHeading="Why Tint Your Home?"
      relatedLinks={[
        { label: 'Talega Window Tint',   href: '/talega-window-tint'        },
        { label: 'San Clemente Tint',    href: '/san-clemente-window-tint'  },
        { label: 'Commercial Tint',      href: '/commercial-window-tint'    },
        { label: 'Automotive Tint',      href: '/automotive-window-tint'    },
      ]}
    />
  );
}
