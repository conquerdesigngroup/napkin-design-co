import type { Metadata } from 'next';
import { archivo, jetbrains } from './fonts';
import './globals.css';

import SvgDefs from '@/components/SvgDefs';
import Intro from '@/components/Intro';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SketchMode from '@/components/SketchMode';
import PenCursor from '@/components/PenCursor';
import Reveals from '@/components/Reveals';
import GlassRefraction from '@/components/GlassRefraction';

export const metadata: Metadata = {
  metadataBase: new URL('https://napkindesign.co'),
  title: 'Napkin Design Co. | Web design and SEO for small business',
  description:
    'Hand-coded websites and the SEO engine behind them, for small businesses that started as a sketch on a napkin. No page builders, no contracts, you own everything.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Napkin Design Co. | We make small business look huge',
    description:
      'Web design & SEO that takes you from napkin sketch to ranking on Google. 0 → 29,885 impressions on our own site in 4 months.',
    type: 'website',
    url: 'https://napkindesign.co/',
  },
};

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Napkin Design Co.',
  url: 'https://napkindesign.co',
  email: 'contact@napkindesign.co',
  slogan: 'sketch it. ship it. rank it.',
  description: 'Hand-coded websites and the SEO engine behind them, for small businesses.',
  founder: { '@type': 'Person', name: 'Dustyn Reno' },
};

/* Without JS every word is still here, so resolve the states that motion would have resolved. */
const NOSCRIPT_CSS = `
#intro,.sketch-fab,.sketch-hint,#cursor,#trail{display:none}
#nav{opacity:1!important}
.hero .line-in{transform:none}
.hero-sub,.hero-cta,.hero-receipt,.hero-object,.meta-strip,.reveal{opacity:1;transform:none}
.small-note path,.svc .scribble path{stroke-dashoffset:0}
.svc .plate{opacity:1;transform:none}.svc .plate img{transform:none}
.svc .name{color:var(--napkin);-webkit-text-stroke-color:transparent}.svc .scribble{opacity:0}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />

        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <SvgDefs />

        <div className="mesh" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="grain" aria-hidden="true" />

        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
        </noscript>

        <Intro />
        <Nav />

        {children}

        <Footer />

        <SketchMode />
        <PenCursor />

        <Reveals />
        <GlassRefraction />
      </body>
    </html>
  );
}
