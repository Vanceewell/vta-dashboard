import Navigation from './Navigation';
import Footer from './Footer';

// Plain text page shell for the privacy and accessibility pages.
export default function LegalPage({ title, updated, children }: {
  title:    string;
  updated:  string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="bg-jgt-bg pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6 lg:px-8 font-sans font-light text-jgt-muted leading-relaxed text-[0.95rem] space-y-5 [&_h2]:font-display [&_h2]:text-jgt-text [&_h2]:text-2xl [&_h2]:mt-10 [&_a]:text-jgt-gold [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
          <h1 className="font-display text-jgt-text" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>{title}</h1>
          <p className="text-xs">Last updated {updated}</p>
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
