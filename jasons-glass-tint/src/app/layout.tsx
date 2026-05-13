import type { Metadata } from 'next';
import './globals.css';

// AI-EDITABLE: site metadata
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jasonsglasstint.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jason's Glass Tint | Window Tinting San Clemente Since 1989",
    template: "%s | Jason's Glass Tint San Clemente",
  },
  description:
    "San Clemente's most trusted window tint installer since 1989. Jason personally installs every project — automotive, residential, commercial, marine, RV, frost & safety film. No subcontractors. Premium film. Honest pricing.",
  keywords: [
    'window tint San Clemente',
    'window tinting San Clemente',
    'automotive window tint',
    'residential window tint',
    'commercial window tint Orange County',
    'marine tint San Clemente',
    'Talega window tint',
    'Dana Point window tint',
    'San Juan Capistrano window tint',
    "Jason's Glass Tint",
  ],
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:          SITE_URL,
    siteName:    "Jason's Glass Tint",
    title:       "Jason's Glass Tint | Trusted Since 1989 — San Clemente, CA",
    description: "Premium window tint installation by Jason himself. Automotive, residential, commercial & marine film for San Clemente and South Orange County.",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: "Jason's Glass Tint — San Clemente" }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       "Jason's Glass Tint | San Clemente's Premier Window Tinting",
    description: 'Premium tint installed personally by Jason. 40+ years experience. Automotive, residential, commercial & marine.',
    images:      ['/og-image.jpg'],
  },
  robots: {
    index:        true,
    follow:       true,
    googleBot:    { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: SITE_URL },
};

const localBusinessSchema = {
  '@context':   'https://schema.org',
  '@type':      'LocalBusiness',
  name:         "Jason's Glass Tint",
  description:  "Premium window tint installation for automotive, residential, commercial, marine, RV, frost, and safety film throughout San Clemente and South Orange County.",
  url:           SITE_URL,
  telephone:    '+19494968468',
  address: {
    '@type':           'PostalAddress',
    addressLocality:   'San Clemente',
    addressRegion:     'CA',
    addressCountry:    'US',
  },
  geo: {
    '@type':    'GeoCoordinates',
    latitude:   '33.4269',
    longitude:  '-117.6119',
  },
  areaServed: [
    { '@type': 'City', name: 'San Clemente' },
    { '@type': 'City', name: 'Talega' },
    { '@type': 'City', name: 'Dana Point' },
    { '@type': 'City', name: 'San Juan Capistrano' },
    { '@type': 'AdministrativeArea', name: 'South Orange County' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name:    'Window Tinting Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automotive Window Tinting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Residential Window Tinting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Window Tinting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Marine Window Tinting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'RV Window Tinting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Frost Film Installation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Safety Film Installation' } },
    ],
  },
  foundingDate: '1989',
  priceRange:   '$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0F0F0F" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NCJLPY9NFT"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NCJLPY9NFT');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
