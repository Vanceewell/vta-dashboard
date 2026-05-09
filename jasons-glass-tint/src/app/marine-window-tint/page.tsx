import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Marine Window Tinting San Clemente & Dana Point | Jason's Glass Tint",
  description: "Professional marine window tinting for boats, yachts, and watercraft in San Clemente and Dana Point. Marine-grade film built for salt air and coastal UV. Call (949) 496-8468.",
  openGraph: {
    title: "Marine Window Tinting San Clemente | Jason's Glass Tint",
    description: "Marine-grade window film for boats and yachts at Dana Point Harbor and San Clemente. Jason personally installs every marine project.",
    url: 'https://jasonsglasstint.com/marine-window-tint',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/marine-window-tint' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Marine Window Tinting",
        headline: "Marine Window Tinting for Dana Point & San Clemente",
        sub:      "Boats and yachts face some of the most demanding UV and heat conditions in existence. Jason installs marine-grade window film engineered specifically for the coastal marine environment.",
        img:      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1400&q=80",
      }}
      intro="Water reflects and amplifies UV radiation — meaning UV exposure on the water can be 50% higher than on land. Marine window film isn't just a comfort upgrade; it's a meaningful protection investment for passengers, interior materials, and the vessel itself."
      sections={[
        {
          heading: "Why Marine Window Film Is Different",
          body: "Marine environments present unique challenges that standard automotive or residential film isn't designed to handle. Salt air, high humidity, constant UV exposure, and curved or irregular glass shapes demand a film that is specifically formulated for marine applications. Jason uses marine-grade film from professional manufacturers — film engineered to resist salt-air degradation, maintain adhesion in high-humidity conditions, and maintain optical clarity on curved glass. The same film that works perfectly on a land vehicle may delaminate, bubble, or discolor on a boat within months. Jason brings the expertise to choose the right product for the marine environment.",
        },
        {
          heading: "Comfort and Protection on the Water",
          body: "Boat cabins and pilothouse windows are subject to intense sun exposure at close angles that amplify heat and UV. Quality marine window film reduces cabin temperatures significantly, making hours-long passages dramatically more comfortable. UV protection is especially critical on the water — prolonged UV exposure damages electronics, navigation instruments, upholstery, carpet, and interior wood, all of which are expensive to replace on a quality vessel. Many Dana Point Harbor boaters have found that marine window film extends the life of their cabin interiors significantly, and pays for itself through reduced maintenance and replacement costs over the vessel's life.",
        },
        {
          heading: "Installation at Dana Point Harbor and San Clemente",
          body: "Jason is familiar with the Dana Point Harbor marina and the types of vessels that call it home — from center consoles and sportfishers to offshore cruisers and sailing yachts. He can come to your slip for installation, minimizing the need to haul the boat. Marine installs require more time and precision than standard automotive work due to the irregular shapes and curved surfaces involved. Jason brings the patience and skill that marine glass demands — taking as much time as needed to achieve a clean, professional result.",
        },
      ]}
      benefits={[
        'Marine-grade film formulated for salt air and coastal UV',
        'Reduce cabin temperatures significantly on the water',
        '99.9% UV protection for passengers and interior materials',
        'Jason installs every marine project himself',
        'Experienced with curved and irregular marine glass',
        'Can install at Dana Point Harbor — no haul required',
        'All vessel types: sportfishers, cruisers, sailing yachts, RIBs',
      ]}
      faqs={[
        {
          q: 'Can Jason come to my slip at Dana Point Harbor?',
          a: "Yes. Jason can typically come directly to the marina for marine installations, eliminating the need to haul the boat. Contact him to arrange access and scheduling.",
        },
        {
          q: 'Does marine window film affect visibility for navigation?',
          a: "Jason installs marine film that maintains high visible light transmission, so visibility from the helm and through cabin glass is not compromised. The film reduces glare and UV without creating a dark or distorted view.",
        },
        {
          q: 'How long does marine window film last?',
          a: "Marine-grade film from professional manufacturers typically carries a 5–10 year warranty depending on the product. In practice, well-installed marine film on vessels properly maintained in a covered slip often lasts longer than the warranty period.",
        },
      ]}
      relatedLinks={[
        { label: 'Dana Point Tint',    href: '/dana-point-window-tint'   },
        { label: 'San Clemente Tint',  href: '/san-clemente-window-tint' },
        { label: 'Automotive Tint',    href: '/automotive-window-tint'   },
        { label: 'Commercial Tint',    href: '/commercial-window-tint'   },
      ]}
    />
  );
}
