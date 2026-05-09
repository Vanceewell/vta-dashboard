import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Commercial Window Tinting Orange County | Jason's Glass Tint",
  description: "Commercial window tinting for offices, retail, and businesses throughout San Clemente and South Orange County. Energy efficiency, privacy, and professional appearance. Call (949) 496-8468.",
  openGraph: {
    title: "Commercial Window Tinting Orange County | Jason's Glass Tint",
    description: "Professional commercial tinting for San Clemente and South OC businesses. Solar control, privacy film, storefront tinting by Jason himself.",
    url: 'https://jasonsglasstint.com/commercial-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/commercial-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Commercial Window Tinting",
        headline: "Commercial Tinting for South Orange County Businesses",
        sub:      "Reduce energy costs, improve employee comfort, enhance your building's appearance, and protect inventory from UV damage — all with professional commercial window film installed by Jason himself.",
        img:      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80",
        slot:     'commercialPageHero',
      }}
      intro="Commercial window tinting is one of the most impactful investments a South Orange County business can make. The ROI on energy savings alone often justifies the cost within two to three years — and that's before accounting for improved comfort, reduced glare, and enhanced building aesthetics."
      sections={[
        {
          heading: "Commercial Window Film That Pays for Itself",
          body: "In Southern California's climate, solar heat gain through commercial glass is one of the largest contributors to HVAC costs. Commercial-grade solar control film can reduce solar heat gain by 60–80%, directly translating to lower electricity bills. For businesses in San Clemente, Dana Point, and San Juan Capistrano with significant glass exposure — storefronts, office buildings, medical clinics, retail spaces — the annual energy savings can be substantial. Jason has completed commercial tinting projects throughout South Orange County and can provide real-world reference points for the efficiency improvements his clients have experienced.",
        },
        {
          heading: "Professional Appearance and Privacy",
          body: "Commercial window film does more than save energy — it transforms the appearance of a building. A professionally tinted commercial facade has a polished, intentional look that communicates quality and attention to detail. For office environments, one-way mirror film provides privacy during daylight hours without blocking the view from inside. For retail spaces, decorative and frosted film creates defined visual zones, highlights signage, and improves the shopping environment. Jason approaches every commercial project with the same care he brings to high-end residential and automotive work.",
        },
        {
          heading: "UV Protection for Merchandise and Interiors",
          body: "For retail businesses, UV protection is a significant factor. Premium commercial solar control film blocks 99.9% of UV rays — directly protecting merchandise from fading and discoloration. Clothing retailers, furniture showrooms, art galleries, and food & beverage businesses all benefit from UV-blocking commercial film. For medical and professional offices, UV protection preserves the appearance of waiting areas, reception spaces, and patient rooms over time. The payback here is preservation of interior assets that would otherwise require periodic replacement due to sun damage.",
        },
      ]}
      benefits={[
        'Reduce HVAC costs by 15–30% in commercial buildings',
        'Block 99.9% of UV rays — protect merchandise and interiors',
        'Improve employee comfort and productivity',
        'Professional one-way privacy film for offices',
        'Decorative and frosted film for visual zoning',
        'Safety film for building code compliance',
        'Jason personally handles every commercial install',
      ]}
      faqs={[
        {
          q: 'Can commercial tinting be done during business hours?',
          a: "Jason can often schedule commercial installs during off-hours or on weekends to minimize business disruption. For larger projects, he'll work with you to develop a phased installation schedule.",
        },
        {
          q: 'Is commercial window film compliant with building codes?',
          a: "Professional commercial film from Madico Window Film meets California energy code requirements and building standards. Jason is familiar with local requirements and can advise on compliant specifications.",
        },
        {
          q: 'What types of commercial buildings does Jason tint?',
          a: "Jason has experience with office buildings, retail storefronts, medical clinics, restaurants, schools, and multi-unit residential buildings throughout San Clemente, Dana Point, and San Juan Capistrano.",
        },
      ]}
      relatedLinks={[
        { label: 'San Clemente Tint',  href: '/san-clemente-window-tint' },
        { label: 'Residential Tint',   href: '/residential-window-tint'  },
        { label: 'Dana Point Tint',    href: '/dana-point-window-tint'   },
        { label: 'SJC Tint',           href: '/san-juan-capistrano-window-tint' },
      ]}
    />
  );
}
