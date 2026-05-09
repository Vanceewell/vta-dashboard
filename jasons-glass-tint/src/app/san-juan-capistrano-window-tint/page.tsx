import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Window Tinting San Juan Capistrano | Jason's Glass Tint",
  description: "Professional window tinting for homes and businesses in San Juan Capistrano. Serving SJC and South Orange County since 1989. Call (949) 496-8468.",
  openGraph: {
    title: "Window Tinting San Juan Capistrano | Jason's Glass Tint",
    description: "Premium residential and commercial window tinting in San Juan Capistrano by Jason himself. 40+ years experience.",
    url: 'https://jasonsglasstint.com/san-juan-capistrano-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/san-juan-capistrano-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "San Juan Capistrano, California",
        headline: "Window Tinting in San Juan Capistrano",
        sub:      "San Juan Capistrano's mix of historic properties, modern neighborhoods, and thriving commercial district makes it one of South OC's most diverse tinting markets. Jason has served SJC clients for over 40 years.",
        img:      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
        slot:     'sanJuanPageHero',
      }}
      intro="San Juan Capistrano is a community with deep roots and a growing modern character. Whether you're in a historic Capistrano Beach home, a newer Vermejo or Pacifica neighborhood, or running a business on Ortega Highway, Jason's Glass Tint brings the same premium service to SJC that it has for San Clemente since 1989."
      sections={[
        {
          heading: "Residential Window Tinting in San Juan Capistrano",
          body: "San Juan Capistrano's residential landscape spans from historic adobes and craftsman bungalows near the mission district to contemporary homes in newer subdivisions. Both ends of the spectrum benefit from professional window film. For older homes with single-pane glass, solar control film adds meaningful insulation value while reducing heat gain. For newer homes with large windows and open floor plans, film is essential for comfort and energy management. Jason regularly serves SJC homeowners across all neighborhood types — and his 40+ years of experience means he's familiar with the specific window configurations common in each area.",
        },
        {
          heading: "Commercial Tinting on Ortega Highway and Beyond",
          body: "San Juan Capistrano has an active commercial corridor along Ortega Highway and Del Obispo Street. Restaurants, retail shops, professional offices, and service businesses along these corridors regularly turn to Jason for commercial solar control film. The combination of energy efficiency, improved customer environment, and enhanced exterior appearance makes commercial tinting one of the most cost-effective building upgrades available to SJC business owners. Jason handles commercial installs on weekday off-hours or weekends to minimize business disruption.",
        },
        {
          heading: "Automotive Tinting for San Juan Capistrano Residents",
          body: "Jason serves automotive clients throughout San Juan Capistrano, from the Stoneridge and Marbella communities to the downtown area. Many SJC residents choose Jason over closer options because his reputation for quality and personal installation is well-established throughout South Orange County. Ceramic film installs on luxury vehicles are a particular specialty — Jason understands that a high-end car deserves the same level of care from its installer as from its manufacturer.",
        },
      ]}
      benefits={[
        'Serving San Juan Capistrano clients since 1989',
        'Residential film for all home styles — historic to contemporary',
        'Commercial tinting for Ortega Highway businesses',
        'Automotive tinting including luxury and exotic vehicles',
        'Jason personally handles every SJC installation',
        'Energy-efficient film for both residential and commercial',
        'Manufacturer warranty on all installed film',
      ]}
      faqs={[
        {
          q: 'Does Jason service San Juan Capistrano?',
          a: "Yes. San Juan Capistrano is within Jason's regular service area. He serves both residential and commercial clients throughout SJC, as well as automotive work for area residents.",
        },
        {
          q: 'Is window tinting beneficial for older homes in San Juan Capistrano?',
          a: "Absolutely. Older homes in SJC often have single-pane windows with minimal insulation value. Solar control film adds meaningful heat rejection and UV protection to these windows at a fraction of the cost of window replacement.",
        },
        {
          q: 'Can Jason handle commercial tinting for a larger San Juan Capistrano building?',
          a: "Yes. Jason has completed commercial projects of significant scale throughout South OC. For larger buildings, he develops a phased installation schedule to accommodate business operations.",
        },
      ]}
      relatedLinks={[
        { label: 'San Clemente Tint',  href: '/san-clemente-window-tint' },
        { label: 'Dana Point Tint',    href: '/dana-point-window-tint'   },
        { label: 'Residential Tint',   href: '/residential-window-tint'  },
        { label: 'Commercial Tint',    href: '/commercial-window-tint'   },
      ]}
    />
  );
}
