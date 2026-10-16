import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title:       'Privacy Policy',
  description: "How Jason's Glass Tint handles information from website visitors and customers.",
  alternates:  { canonical: 'https://www.jasonsglasstint.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 15, 2026">
      <p>
        Jason&apos;s Glass Tint (&quot;we&quot;) runs this website. This page explains what
        information we collect, how we use it, and your choices. It is written to meet the
        California Online Privacy Protection Act.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong className="text-jgt-text font-400">When you contact us.</strong> If you call,
          text, or email, we receive your phone number or email address and whatever you choose
          to send, such as photos of your vehicle or windows. We use it only to reply, quote,
          and schedule your job.
        </li>
        <li>
          <strong className="text-jgt-text font-400">Website usage.</strong> We use Google
          Analytics to count visits and see which pages and buttons people use. Google Analytics
          sets cookies and collects your IP address, browser and device type, the pages you view,
          and when you visit. We do not use it to identify you personally.
        </li>
      </ul>
      <p>This website has no forms, accounts, or checkout, and it does not collect payment information.</p>

      <h2>How we share it</h2>
      <p>
        We do not sell or rent your personal information, and we do not share it for advertising.
        Website usage data is processed by Google under the{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
        We may disclose information if the law requires it.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>
          You can block or delete cookies in your browser settings, or install the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out add-on</a>.
        </li>
        <li>
          Do Not Track: browsers can send a &quot;Do Not Track&quot; signal. This site does not
          change its behavior in response to it; use the options above to limit tracking.
        </li>
        <li>
          To ask what we have about you, or to have it corrected or deleted, text or call
          (949) 496-8468.
        </li>
      </ul>

      <h2>Children</h2>
      <p>This website is not directed to children under 13, and we do not knowingly collect their information.</p>

      <h2>Changes and contact</h2>
      <p>
        If we change this policy we will update the date at the top of this page. Questions:
        Jason&apos;s Glass Tint, 23 Via Conocido, San Clemente, CA 92673, (949) 496-8468.
      </p>
    </LegalPage>
  );
}
