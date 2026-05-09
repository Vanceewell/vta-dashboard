import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Window Tinting Camp Pendleton | Jason's Glass Tint -- San Clemente",
  description: "Window tinting serving Marines and military families near Camp Pendleton. Automotive, residential, and base-area housing tinting. Jason personally installs every job. Call (949) 496-8468.",
  openGraph: {
    title: "Window Tinting Camp Pendleton | Jason's Glass Tint",
    description: "Serving Marines and military families near Camp Pendleton with premium window film. Automotive and residential tinting by Jason himself -- straight talk, quality work.",
    url: 'https://jasonsglasstint.com/camp-pendleton-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/camp-pendleton-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Camp Pendleton",
        headline: "Window Tinting for Marines & Military Families",
        sub:      "Jason's Glass Tint proudly serves the Marines and military families at and near Camp Pendleton. Straightforward pricing, quality film, and work done right -- installed personally by Jason every time.",
        img:      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80",
        slot:     'campPendletonPageHero',
      }}
      intro="Camp Pendleton's Southern California location means intense sun, significant UV exposure, and heat that accumulates quickly in vehicles and base-area housing. Premium window film is one of the most practical and durable upgrades for military personnel and their families -- and Jason has been serving this community with respect and quality for decades."
      sections={[
        {
          heading: "Automotive Tinting for Marines and Military Families",
          body: "Vehicles parked on base or in base-area neighborhoods sit in direct Southern California sun for hours at a time. The interior heat buildup, UV damage to upholstery and dashboards, and glare reduction challenges are real -- and ceramic window film addresses all of them. Jason installs ceramic and carbon film on all vehicle types: personal vehicles, trucks, SUVs, and family cars. Ceramic film provides the highest heat rejection (up to 96%) and UV protection (99.9%) with no interference with GPS or electronic systems. It's built to last and won't fade, purple, or peel. Jason stands behind his work and installs every vehicle himself.",
        },
        {
          heading: "Residential and Base-Area Housing",
          body: "Military families living in base-area neighborhoods around Camp Pendleton -- in Oceanside, San Clemente, San Juan Capistrano, and surrounding communities -- deal with the same intense Southern California sun as everyone else in the region. Residential solar control film reduces interior heat gain significantly, lowering cooling costs and making living spaces more comfortable during California's long warm season. UV protection preserves furniture, flooring, and interior finishes -- important for families who want their home to stay in good condition throughout their time at Pendleton. Jason serves base-area residential clients directly and can typically coordinate a visit around your schedule.",
        },
        {
          heading: "Glare Reduction and Privacy",
          body: "Glare is a day-to-day quality-of-life issue in Southern California -- particularly for west-facing windows in the late afternoon. Window film dramatically reduces interior glare while maintaining natural light. For vehicles, glare reduction improves driving comfort and reduces eye strain on long commutes. Privacy film is also available for residential windows where visibility from the street or neighboring homes is a concern. Jason can recommend the right combination of products based on your specific needs.",
        },
        {
          heading: "Durable Film Built for Hard Use",
          body: "Jason installs only professional-grade film from Madico Window Film -- the same brand used in commercial and government applications. These films are built to handle the Southern California climate: color-stable, scratch-resistant, and backed by manufacturer warranties. For military families who move periodically, quality film is an investment that enhances the vehicle or home while they're there -- and increases the value for the next occupant. Jason's installs are done right the first time, with no shortcuts.",
        },
      ]}
      benefits={[
        'Jason personally installs every project -- no subcontractors',
        'Automotive ceramic film -- up to 96% heat rejection, 99.9% UV protection',
        'Glare reduction for driving and interior living comfort',
        'Residential solar control film for base-area housing',
        'Privacy film available for residential windows',
        'Premium film brand: Madico Window Film',
        'Manufacturer warranty on all installed film',
        'Straight talk -- honest pricing, quality work, no runaround',
      ]}
      faqs={[
        {
          q: 'Does Jason serve the Camp Pendleton area directly?',
          a: "Yes. Jason serves clients in and around Camp Pendleton -- including base-adjacent communities in Oceanside, San Clemente, and San Juan Capistrano. Text him at (949) 496-8468 to discuss your project and arrange a time.",
        },
        {
          q: 'What is the best window film for a vehicle parked on base?',
          a: "For vehicles that see significant daily sun exposure, ceramic film is the top recommendation. It provides the highest heat rejection and UV protection, has no interference with GPS or electronic systems, and is color-stable -- it will not fade or purple over time. Jason can walk you through the options based on your vehicle and priorities.",
        },
        {
          q: 'Can Jason tint base-area housing?',
          a: "Yes. Jason installs residential window film for military families in base-adjacent communities. Solar control film reduces heat gain, cuts UV exposure, and lowers cooling costs -- practical benefits that improve day-to-day living comfort.",
        },
        {
          q: 'Does window film interfere with GPS or radio on military vehicles?',
          a: "Ceramic film is specifically non-metallic and does not interfere with GPS, radio, or electronic systems. Jason recommends ceramic film for all vehicles where signal integrity matters. He does not install metallic film that could interfere with electronics.",
        },
        {
          q: 'How long does automotive tinting take?',
          a: "Most standard vehicle installs take 2-4 hours. Jason does not rush -- quality installation requires time, and he takes the time needed to do it right. Text him to schedule and he can give you a realistic time estimate based on your vehicle.",
        },
      ]}
      relatedLinks={[
        { label: 'San Clemente Tint', href: '/san-clemente-window-tint' },
        { label: 'Automotive Tint',   href: '/automotive-window-tint'   },
        { label: 'Residential Tint',  href: '/residential-window-tint'  },
        { label: 'Marine Tint',       href: '/marine-window-tint'       },
      ]}
    />
  );
}
