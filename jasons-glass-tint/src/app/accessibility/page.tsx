import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title:       'Accessibility',
  description: "Jason's Glass Tint's commitment to an accessible website, and how to get help.",
  alternates:  { canonical: 'https://www.jasonsglasstint.com/accessibility' },
};

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility" updated="October 15, 2026">
      <p>
        We want everyone to be able to use this website, including people who use screen
        readers, keyboard navigation, or other assistive technology. We aim to follow the Web
        Content Accessibility Guidelines (WCAG) 2.1 Level AA and keep improving.
      </p>

      <h2>What we have done</h2>
      <ul>
        <li>Images have text descriptions, and each page has a clear heading structure.</li>
        <li>Phone and text links work from any device, and the site works on phones and with keyboard navigation.</li>
        <li>The rotating reviews pause when you hover over them or move keyboard focus into them.</li>
      </ul>

      <h2>Need help or found a problem?</h2>
      <p>
        If anything on this site is hard to use, text or call Jason at{' '}
        <a href="tel:9494968468">(949) 496-8468</a>. He will give you the information you
        need directly and fix the problem on the site. We try to reply within two business days.
      </p>
    </LegalPage>
  );
}
