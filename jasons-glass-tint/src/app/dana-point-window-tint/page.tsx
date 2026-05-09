import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Window Tinting Dana Point | Jason's Glass Tint",
  description: "Professional window tinting for automotive, residential, and marine in Dana Point. Serving Dana Point since 1989. Call (949) 496-8468 for a quote.",
  openGraph: {
    title: "Window Tinting Dana Point | Jason's Glass Tint",
    description: "Car, home, and boat tinting in Dana Point by Jason himself. 40+ years experience, no subcontractors, premium film.",
    url: 'https://jasonsglasstint.com/dana-point-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/dana-point-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Dana Point, California",
        headline: "Window Tinting in Dana Point",
        sub:      "From the harbor to the bluffs, Dana Point is one of South Orange County's most beautiful communities — and one of the most UV-intense. Jason has served Dana Point residents and marina clients for over three decades.",
        img:      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80",
        slot:     'danaPointPageHero',
      }}
      intro="Dana Point's coastal location creates particularly demanding conditions for windows, glass, and vehicles. Reflection off the ocean amplifies UV exposure, and the combination of marine air, heat, and sun demands premium materials and professional installation."
      sections={[
        {
          heading: "Automotive and Marine Tinting at Dana Point Harbor",
          body: "Dana Point is home to one of Southern California's most active recreational harbors. Jason regularly serves boaters with marine-grade window film installation at the marina, and handles automotive tinting for Dana Point residents who want the same quality on their vehicles. The combination of coastal driving conditions — intense UV, salt air, and bright Pacific glare — makes quality automotive tint a practical investment for anyone who drives regularly along PCH or through the Dana Point community.",
        },
        {
          heading: "Residential Tinting for Dana Point's Coastal Homes",
          body: "Dana Point's residential neighborhoods span from the harbor bluffs to the inland hillsides of Monarch Beach and Monarch Bay. Homes on the ocean-facing side experience particularly intense late-afternoon western sun that drives up cooling costs and creates uncomfortable living conditions. Jason installs solar control film that eliminates the majority of that heat gain while preserving ocean views — one of the defining features of a Dana Point home. For homes in Lantern Village and downtown Dana Point, privacy film and decorative frost options are popular for street-facing windows without sacrificing light.",
        },
        {
          heading: "Commercial Window Tinting in Dana Point",
          body: "Dana Point's commercial district, concentrated around PCH and Del Obispo, includes retail shops, restaurants, and professional offices that benefit significantly from commercial window film. Solar control film reduces cooling loads and creates a more comfortable customer environment, while privacy film and decorative options help define retail spaces. Jason has served Dana Point commercial clients for decades and understands the unique requirements of this coastal business community.",
        },
      ]}
      benefits={[
        'Serving Dana Point residential and marina clients since 1989',
        'Marine tinting at Dana Point Harbor — boat-side service',
        'Automotive tinting for coastal UV protection',
        'Residential tinting preserving ocean views',
        'Commercial film for Dana Point businesses',
        'Jason personally installs every Dana Point project',
        'No subcontractors, honest pricing',
      ]}
      faqs={[
        {
          q: 'Does Jason service Dana Point Harbor for boat tinting?',
          a: "Yes. Jason can come directly to your slip at Dana Point Harbor for marine installations. No haul-out required in most cases. Contact him to arrange access and scheduling.",
        },
        {
          q: 'How does coastal UV affect window film differently?',
          a: "UV reflected off ocean water is significantly more intense than on land — up to 50% higher in some conditions. This means coastal windows on vehicles, boats, and homes experience more UV stress. Premium film with certified UV rejection rates holds up better in coastal conditions than budget-tier alternatives.",
        },
        {
          q: 'What residential film is best for Dana Point ocean views?',
          a: "Jason typically recommends neutral solar control film from Madico Window Film for ocean-view homes — it provides maximum heat and UV rejection with very high visible light transmission, preserving the view clarity that makes coastal homes valuable.",
        },
      ]}
      relatedLinks={[
        { label: 'Marine Tint',         href: '/marine-window-tint'        },
        { label: 'San Clemente Tint',   href: '/san-clemente-window-tint'  },
        { label: 'Automotive Tint',     href: '/automotive-window-tint'    },
        { label: 'SJC Tint',            href: '/san-juan-capistrano-window-tint' },
      ]}
    />
  );
}
