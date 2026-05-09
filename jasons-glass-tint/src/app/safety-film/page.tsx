import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: "Safety & Security Window Film | Jason's Glass Tint — San Clemente",
  description: "Professional safety and security window film installation in San Clemente. Reinforce glass, slow forced entry, protect against accidents. Installed personally by Jason. Call (949) 496-8468.",
  openGraph: {
    title: "Safety & Security Window Film | Jason's Glass Tint",
    description: "Safety film holds broken glass in place — added protection for homes, businesses, and vehicles. Installed personally by Jason in San Clemente and South Orange County.",
    url: 'https://jasonsglasstint.com/safety-film',
  },
  alternates: { canonical: 'https://jasonsglasstint.com/safety-film' },
};

export default function Page() {
  return (
    <LandingPageTemplate
      hero={{
        label:    "Safety & Security Film",
        headline: "Glass That Holds When It Matters",
        sub:      "Safety window film bonds to your existing glass and holds it together on impact — reducing injury risk, slowing forced entry, and adding a meaningful layer of protection to homes and businesses throughout San Clemente and South Orange County.",
        img:      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
        slot:     'safetyPageHero',
      }}
      intro="Glass is the most vulnerable point in most homes and commercial buildings — and it's rarely treated as a priority. Safety window film doesn't make glass unbreakable, but it fundamentally changes what happens when glass is struck: instead of shattering into dangerous fragments, it holds together."
      sections={[
        {
          heading: "How Safety Film Works",
          body: "Safety window film is a thick, optically clear polyester film that adheres directly to your existing glass. When the glass is struck — by an object, by force, or by accident — the film holds the broken pieces in place rather than allowing them to scatter. The film acts as a bonding layer between the glass and the frame, significantly increasing the amount of force required to create an opening. This is the same basic principle used in automotive laminated glass and in building code-compliant safety glazing. Professional installation ensures the film is bonded to the glass at full adhesion with no bubbles, lifting edges, or weak points.",
        },
        {
          heading: "Protection Against Forced Entry",
          body: "Safety film has helped protect many San Clemente homes from attempted break-ins. While safety film does not make glass impenetrable, it significantly increases the time and effort required to break through — and most opportunistic break-in attempts are abandoned quickly when resistance is encountered. A window with safety film applied does not shatter cleanly on the first strike; it requires sustained, repeated effort to compromise. That additional delay is often enough. For sliding glass doors, large picture windows, and ground-floor windows facing alleys or secluded areas, safety film adds meaningful protection at a fraction of the cost of window replacement or alarm systems.",
        },
        {
          heading: "Accident Protection and Code Compliance",
          body: "Beyond security, safety film addresses everyday accident risk. Patio doors, sidelights, and large glass panels near entryways are common sites of accidental breakage — and when tempered glass shatters, it does so in thousands of small pieces that present a real injury hazard. Safety film holds those pieces together, dramatically reducing the risk of lacerations. For commercial buildings, certain applications of safety film may satisfy building code requirements for safety glazing. Jason is familiar with local requirements and can advise on film specifications that meet code.",
        },
        {
          heading: "UV Protection Included",
          body: "Professional safety films from Madico Window Film include a high level of UV protection — typically 99%+ UV rejection. This is not the primary reason clients choose safety film, but it's a meaningful added benefit: the same installation that reinforces your glass also protects your interiors, furnishings, and flooring from UV fading. For South Orange County homes with significant sun exposure, the UV protection benefit of safety film is real and lasting.",
        },
      ]}
      benefits={[
        'Holds broken glass together — dramatically reduces shattering and laceration risk',
        'Increases forced-entry resistance — delays and deters break-in attempts',
        'Optically clear — no change to visible appearance',
        'Adds meaningful protection to sliding doors, patio glass, and ground-floor windows',
        '99%+ UV rejection included',
        'Applied to existing glass — no window replacement required',
        'May satisfy building code safety glazing requirements',
        'Installed personally by Jason — no subcontractors',
      ]}
      faqs={[
        {
          q: 'Does safety film make glass unbreakable?',
          a: "No — and any installer who claims otherwise is misrepresenting the product. Safety film significantly increases the force required to break through glass and holds broken pieces in place, but it does not make glass impenetrable. Its value is in what happens after glass is struck: instead of instantly shattering and creating an opening, the glass holds together, requiring sustained effort to compromise.",
        },
        {
          q: 'What thickness of safety film does Jason install?',
          a: "Safety films range from 4 mil to 14 mil or more in thickness. Thicker films provide greater protection against both impact and forced entry. Jason will assess your specific situation — window size, frame type, security concerns, and code requirements — and recommend the appropriate specification.",
        },
        {
          q: 'Can safety film be applied to existing windows without replacing them?',
          a: "Yes — that is the primary advantage of safety film. Jason applies it directly to your existing glass, bonding it to the surface at full adhesion. No window replacement, no new frames, no construction. The upgrade is completed in a single visit.",
        },
        {
          q: 'Is safety film visible on the glass?',
          a: "High-quality safety film is optically clear — it is essentially invisible once installed. From inside or outside, the glass looks identical to untreated glass. The only difference is what happens when it is struck.",
        },
        {
          q: 'Does Jason install safety film on sliding glass doors?',
          a: "Yes. Sliding glass doors are one of the most common applications for safety film — they are large, often in less-visible areas of a home, and represent a significant point of vulnerability. Jason regularly installs safety film on sliding glass doors throughout San Clemente, Talega, Dana Point, and San Juan Capistrano.",
        },
      ]}
      relatedLinks={[
        { label: 'Residential Tint',  href: '/residential-window-tint'  },
        { label: 'Commercial Tint',   href: '/commercial-window-tint'   },
        { label: 'Frost Film',        href: '/frost-film'               },
        { label: 'San Clemente Tint', href: '/san-clemente-window-tint' },
      ]}
    />
  );
}
