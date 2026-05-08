import Link from 'next/link';

// AI-EDITABLE: footer links & content
const SERVICE_LINKS = [
  { label: 'Automotive Tint',    href: '/automotive-window-tint'           },
  { label: 'Residential Tint',   href: '/residential-window-tint'          },
  { label: 'Commercial Tint',    href: '/commercial-window-tint'           },
  { label: 'Marine Tint',        href: '/marine-window-tint'               },
  { label: 'RV Tint',            href: '#contact'                          },
  { label: 'Frost Film',         href: '#contact'                          },
  { label: 'Safety Film',        href: '#contact'                          },
];

const AREA_LINKS = [
  { label: 'San Clemente',         href: '/san-clemente-window-tint'          },
  { label: 'Talega',               href: '/talega-window-tint'               },
  { label: 'Dana Point',           href: '/dana-point-window-tint'           },
  { label: 'San Juan Capistrano',  href: '/san-juan-capistrano-window-tint'  },
  { label: 'South Orange County',  href: '#service-areas'                    },
];

const QUICK_LINKS = [
  { label: 'Home',          href: '/'                 },
  { label: 'About Jason',   href: '#about'            },
  { label: 'Gallery',       href: '#gallery'          },
  { label: 'Reviews',       href: '#reviews'          },
  { label: 'Process',       href: '#process'          },
  { label: 'Upload Photos', href: '/admin-gallery'    },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] border-t border-jgt-border/50">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-6">
              <div className="font-display text-jgt-text text-xl mb-1">Jason's Glass Tint</div>
              <div className="font-sans text-jgt-gold text-[10px] tracking-[0.22em] uppercase">Trusted Since 1989</div>
            </div>

            <p className="font-sans font-light text-jgt-muted text-xs leading-relaxed mb-6 max-w-xs">
              San Clemente's premier window tint installer. Every project personally handled by
              Jason — no subcontractors, no shortcuts, no surprises.
            </p>

            {/* Contact */}
            <div className="space-y-2">
              <a href="tel:9494968468" className="flex items-center gap-3 font-sans text-sm text-jgt-text hover:text-jgt-gold transition-colors cursor-pointer">
                <PhoneIcon />
                (949) 496-8468
              </a>
              <a href="sms:9494968468" className="flex items-center gap-3 font-sans text-xs text-jgt-muted hover:text-jgt-gold transition-colors cursor-pointer">
                <MessageIcon />
                Text for fastest response
              </a>
              <div className="flex items-center gap-3 font-sans text-xs text-jgt-muted">
                <MapPinIcon />
                San Clemente, California
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-jgt-text text-xs tracking-[0.18em] uppercase font-500 mb-5">Services</h4>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="font-sans text-jgt-muted text-xs hover:text-jgt-gold transition-colors cursor-pointer">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-sans text-jgt-text text-xs tracking-[0.18em] uppercase font-500 mb-5">Service Areas</h4>
            <ul className="space-y-2.5">
              {AREA_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="font-sans text-jgt-muted text-xs hover:text-jgt-gold transition-colors cursor-pointer">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-jgt-text text-xs tracking-[0.18em] uppercase font-500 mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="font-sans text-jgt-muted text-xs hover:text-jgt-gold transition-colors cursor-pointer">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="sms:9494968468"
              className="mt-8 btn-gold text-xs px-5 py-3 inline-flex w-full justify-center"
            >
              Text Jason
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-jgt-border/30 px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-jgt-muted text-xs">
            &copy; {year} Jason's Glass Tint. All rights reserved. San Clemente, California.
          </p>
          <p className="font-sans text-jgt-muted/50 text-xs">
            Premium film. Honest service. One town, one tint.
          </p>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function MessageIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function MapPinIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
