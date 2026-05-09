import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Window Tinting Ladera Ranch | Jason's Glass Tint -- San Clemente",
  description: "Premium residential and automotive window tinting for Ladera Ranch. Reduce heat, block UV, protect interiors. Jason personally installs every project. Call (949) 496-8468.",
  openGraph: {
    title: "Window Tinting Ladera Ranch | Jason's Glass Tint",
    description: "Serving Ladera Ranch with premium window film installation. Residential, automotive, and commercial tinting by Jason himself. No subcontractors.",
    url: 'https://jasonsglasstint.com/ladera-ranch-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/ladera-ranch-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Ladera Ranch, California",
        headline: "Window Tinting in Ladera Ranch",
        sub:      "Ladera Ranch's well-kept communities and newer-construction homes are a natural fit for premium window film. Jason serves Ladera Ranch clients directly -- personally installing every residential, automotive, and commercial project.",
        img:      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80",
        slot:     'laderaRanchPageHero',
      }}
      intro="Ladera Ranch is a planned community built for the California lifestyle -- and Southern California's sun doesn't spare it. Premium window film is one of the most practical upgrades a Ladera Ranch homeowner can make, reducing heat, protecting interiors, and cutting energy costs year-round."
      sections={[
        {
          heading: "Residential Window Tinting for Ladera Ranch Homes",
          body: "Ladera Ranch features newer-construction homes with open floor plans, large windows, and significant glass exposure -- all designed to bring in light and views. That same design creates real heat gain challenges, especially in west-facing rooms during California's long warm season. Jason installs solar control film that blocks up to 96% of solar heat and 99.9% of UV while maintaining high visible light transmission -- keeping your home bright, comfortable, and energy-efficient. Ladera Ranch homeowners frequently see meaningful reductions in cooling costs after installation, and the protection from UV fading on hardwood floors, furniture, and cabinetry adds lasting value.",
        },
        {
          heading: "Automotive Tinting in Ladera Ranch",
          body: "Jason serves Ladera Ranch automotive clients with the same precision and premium film he brings to every vehicle project. Whether you're driving an SUV, a luxury sedan, or a daily commuter, Jason installs premium American-made film that provides the highest level of heat rejection and UV protection while maintaining optical clarity. Jason works on all vehicle types and takes the time to ensure every install is factory-precise with clean edges and no bubbles. Ladera Ranch clients can text Jason directly to arrange a time.",
        },
        {
          heading: "Commercial Window Tinting for Ladera Ranch Businesses",
          body: "Ladera Ranch's commercial corridors -- retail, professional offices, medical and dental clinics -- benefit from commercial solar control film that reduces energy costs, improves employee comfort, and enhances building appearance. Commercial-grade film can reduce solar heat gain by 60-80%, making a measurable impact on HVAC load for businesses with significant glass exposure. Jason handles commercial installs with minimal disruption and can schedule around business hours where needed.",
        },
        {
          heading: "Privacy and Specialty Film",
          body: "Beyond solar control, Ladera Ranch clients frequently request frosted privacy film for bathrooms, entry sidelights, and interior office glass. Safety film is another common request -- reinforcing glass doors and windows to hold together on impact, adding a meaningful layer of protection. Jason offers the full range of window film solutions and can recommend the right product based on your specific situation and goals.",
        },
      ]}
      benefits={[
        'Jason personally installs every Ladera Ranch project -- no subcontractors',
        'Solar control film blocks up to 96% heat, 99.9% UV',
        'Residential, automotive, and commercial film available',
        'Premium film brand: Madico Window Film',
        'Privacy film and safety film also available',
        'Manufacturer warranty on all installed film',
        'Serving South Orange County communities since 1989',
      ]}
      faqs={[
        {
          q: 'Does Jason serve Ladera Ranch directly?',
          a: "Yes. Ladera Ranch is within Jason's regular service area. He serves both residential and automotive clients throughout the community, and handles commercial projects for Ladera Ranch businesses as well.",
        },
        {
          q: 'What film options are available for Ladera Ranch homes?',
          a: "Jason installs solar control film (heat and UV rejection), privacy and frost film, and safety/security film. For residential applications, solar control film from Madico Window Film is the most common choice -- providing heat rejection and UV protection while maintaining a bright interior and neutral exterior appearance.",
        },
        {
          q: "Does window film affect my home's appearance from the outside?",
          a: "Professional-grade film is designed to present a clean, neutral exterior look. From the outside, treated glass is indistinguishable from standard glass in most cases. Jason selects film that maintains the aesthetic character of your home.",
        },
        {
          q: 'Can Jason tint both my home and my car in one visit?',
          a: "Often yes. Jason regularly coordinates residential and automotive tinting on the same visit for Ladera Ranch clients. Text him to discuss your project and schedule a time.",
        },
      ]}
      relatedLinks={[
        { label: 'San Clemente Tint', href: '/san-clemente-window-tint' },
        { label: 'Residential Tint',  href: '/residential-window-tint'  },
        { label: 'Automotive Tint',   href: '/automotive-window-tint'   },
        { label: 'Dana Point Tint',   href: '/dana-point-window-tint'   },
      ]}
    />
  );
}
