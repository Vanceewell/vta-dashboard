import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Window Tinting Ranch Mission Viejo | Jason's Glass Tint",
  description: "Premium residential and automotive window tinting for Ranch Mission Viejo. Reduce heat, block UV, protect interiors. Jason personally installs every project. Call (949) 496-8468.",
  openGraph: {
    title: "Window Tinting Ranch Mission Viejo | Jason's Glass Tint",
    description: "Serving Ranch Mission Viejo with premium window film. Residential and automotive tinting by Jason himself — no subcontractors, honest pricing.",
    url: 'https://jasonsglasstint.com/ranch-mission-viejo-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/ranch-mission-viejo-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Ranch Mission Viejo, California",
        headline: "Window Tinting in Ranch Mission Viejo",
        sub:      "Ranch Mission Viejo's newer homes and family-focused communities are a natural fit for premium residential and automotive window tinting. Jason serves Ranch Mission Viejo directly — personally installing every project.",
        img:      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80",
        slot:     'ranchMissionViejoPageHero',
      }}
      intro="Ranch Mission Viejo is one of South Orange County's newest and most thoughtfully designed communities — built for families, designed for California living, and exposed to the same relentless Southern California sun that makes quality window film a practical necessity rather than a luxury."
      sections={[
        {
          heading: "Residential Window Tinting for Ranch Mission Viejo Homes",
          body: "Ranch Mission Viejo's newer-construction homes feature open floor plans, high ceilings, and expansive windows that maximize natural light and views of the surrounding hills. Those same architectural choices create significant heat gain — particularly in south- and west-facing rooms during California's long warm season. Jason installs professional-grade solar control film that blocks up to 96% of solar heat and 99.9% of UV while maintaining the bright, open feel that Ranch Mission Viejo homes are designed around. The results are immediate: lower interior temperatures, reduced glare, and meaningful energy savings on cooling costs. UV protection also preserves hardwood floors, furniture, and cabinetry from sun-related fading and discoloration — protecting the investment families make in their homes.",
        },
        {
          heading: "Automotive Window Tinting in Ranch Mission Viejo",
          body: "Ranch Mission Viejo families drive. Whether it's daily commutes, school runs, or weekend trips through South OC, vehicles parked and driven in direct Southern California sun accumulate significant heat and UV exposure. Jason installs premium American-made film on all vehicle types — SUVs, sedans, trucks, and family vehicles. The film provides the highest heat rejection (up to 96%) and UV protection (99.9%) with no interference with GPS, Bluetooth, or vehicle electronics. It won't fade, purple, or peel over time. Jason works on every vehicle himself and takes the time to ensure clean edges, no bubbles, and a factory-look result.",
        },
        {
          heading: "Privacy Film and Energy Efficiency",
          body: "Beyond solar control, Ranch Mission Viejo clients frequently request privacy and frost film for bathrooms, entry sidelights, home offices, and street-facing windows. Privacy film lets natural light through while blocking direct sightlines — a practical choice for homes in higher-density neighborhoods or on busier streets within the community. For homeowners focused on energy efficiency, professional window film is one of the highest-return upgrades available: it reduces HVAC load without touching the HVAC system, and the investment typically pays back through energy savings within a few years. Jason can walk you through the specific film options and performance data for each application.",
        },
        {
          heading: "UV Protection That Preserves Your Home",
          body: "Southern California's UV index is among the highest in the country year-round. For Ranch Mission Viejo homeowners, UV exposure through untreated windows is the primary cause of fading in hardwood floors, area rugs, upholstered furniture, window treatments, and cabinetry finishes. Professional window film blocks 99.9% of UV — effectively eliminating the source of that damage. This is a benefit that compounds over time: the longer film is in place, the more it has protected your interior from irreversible UV wear. For newer homes where interior finishes are still in excellent condition, installing film early is the smart move.",
        },
      ]}
      benefits={[
        'Jason personally installs every Ranch Mission Viejo project — no subcontractors',
        'Solar control film blocks up to 96% heat and 99.9% UV',
        'Residential film for new-construction open-plan homes',
        'Premium American-made automotive film for all vehicle types',
        'Privacy and frost film for bathrooms, offices, and street-facing windows',
        'Premium film from Madico Window Film',
        'Manufacturer warranty on all installed film',
        'Serving South Orange County communities since 1989',
      ]}
      faqs={[
        {
          q: 'Does Jason serve Ranch Mission Viejo directly?',
          a: "Yes. Ranch Mission Viejo is within Jason's regular service area. He serves both residential and automotive clients throughout the community and can typically coordinate visits around your schedule.",
        },
        {
          q: 'What is the best window film for a newer Ranch Mission Viejo home?',
          a: "For newer homes with large windows and open floor plans, Jason typically recommends neutral solar control film — it provides maximum heat and UV rejection while maintaining high visible light transmission. The interior stays bright; you simply eliminate the heat and UV that would otherwise come with it.",
        },
        {
          q: 'Will window film change the appearance of my home from the outside?',
          a: "Professional-grade film is designed to present a clean, neutral exterior look. From the outside, treated glass is essentially indistinguishable from untreated glass in most cases. Jason selects film that maintains the aesthetic character of your home.",
        },
        {
          q: 'Can Jason tint both my home and my vehicle in one visit?',
          a: "Often yes. Jason regularly coordinates residential and automotive tinting on the same visit for Ranch Mission Viejo clients. Text him to discuss your project and he can give you a realistic estimate and schedule.",
        },
        {
          q: 'How long does residential window tinting take?',
          a: "Residential installations vary based on the number of windows and the size of the glass. A typical single-family home takes one day or less. Jason will give you a specific time estimate based on your window count and layout before scheduling.",
        },
      ]}
      relatedLinks={[
        { label: 'San Clemente Tint',       href: '/san-clemente-window-tint'       },
        { label: 'Ladera Ranch Tint',        href: '/ladera-ranch-window-tint'        },
        { label: 'Residential Tint',         href: '/residential-window-tint'         },
        { label: 'Automotive Tint',          href: '/automotive-window-tint'          },
        { label: 'San Juan Capistrano Tint', href: '/san-juan-capistrano-window-tint' },
      ]}
    />
  );
}
