import Clock from '@/components/Clock';
import HeroTilt from '@/components/HeroTilt';
import HeroEcho from '@/components/HeroEcho';
import HeadlineLockup from '@/components/HeadlineLockup';
import LogoField from '@/components/LogoField';
import { MAILTO_NEW_PROJECT, MAILTO_FLAT_QUOTE, MAILTO_LETS_GO } from '@/components/links';

const SERVICES = [
  {
    idx: '01',
    name: 'Web design',
    core: true,
    scribble: 'M2,8 C40,4 74,11 112,7 C150,3 186,10 222,6 C252,3 280,9 298,6 M8,10 C60,7 120,12 180,9',
    img: '/keycaps/design.webp',
    alt: 'Green keyboard keycap printed with a crossed axe and pencil, the web design key',
    blurb: 'Hand-coded Next.js. No page builders, ever.',
  },
  {
    idx: '02',
    name: 'SEO',
    core: true,
    scribble: 'M2,7 C50,10 90,4 140,8 C190,12 240,5 298,8 M10,4 C70,7 140,3 210,6',
    img: '/keycaps/seo.webp',
    alt: 'Translucent purple glass keycap printed with SEO, the O drawn as a little devil',
    blurb: 'Local search, content, technical. The engine.',
  },
  {
    idx: '03',
    name: 'Photo & video',
    core: false,
    scribble: 'M2,9 C44,5 86,10 130,6 C176,2 224,9 298,5 M6,11 C66,8 132,12 200,9',
    img: '/keycaps/photo.webp',
    alt: 'Anodized red keycap printed with a camera shutter and play button',
    blurb: 'Real photos of your real work.',
  },
  {
    idx: '04',
    name: 'Branding & design',
    core: false,
    scribble: 'M2,6 C56,10 100,4 152,8 C204,12 250,6 298,9 M12,9 C80,6 150,10 226,7',
    img: '/keycaps/brand.webp',
    alt: 'Translucent green glass keycap printed with a paint palette and brush',
    blurb: 'Logos, palettes, brand systems.',
  },
  {
    idx: '05',
    name: 'Social media',
    core: false,
    scribble: 'M2,8 C48,11 92,5 138,9 C186,12 236,6 298,10 M8,5 C74,8 148,4 222,7',
    img: '/keycaps/social.webp',
    alt: 'Frosted blue glass keycap printed with a thumbs-up, heart and comment bubble',
    blurb: 'Posts, profiles, GBP content.',
  },
  {
    idx: '06',
    name: 'AI automation',
    core: false,
    scribble: 'M2,7 C60,4 108,10 160,6 C212,2 258,9 298,6 M14,10 C84,7 160,11 240,8',
    img: '/keycaps/ai.webp',
    alt: 'Matte pink keycap printed with a friendly robot head',
    blurb: 'Lead follow-up and review requests, on autopilot.',
  },
];

const PROCESS = [
  {
    n: '01 · the napkin part',
    h: 'Sketch',
    p: 'Tell us the idea. We map the pages, the words, and the searches that actually matter.',
  },
  {
    n: '02 · no page builders',
    h: 'Build',
    p: 'We hand-code the site in Next.js. Fast, clean, and yours, down to the last line.',
  },
  {
    n: '03 · the engine',
    h: 'Rank',
    p: 'Content and technical SEO, measured in Search Console. Evidence, not vibes.',
  },
  {
    n: '04 · keep pressing',
    h: 'Grow',
    p: "We watch the data and double down on what's working. The curve keeps its slope.",
  },
];

const FAQ = [
  {
    q: 'What does it cost?',
    a: "It's scope-based. You get a flat quote up front. No hourly meters, no surprises at the end.",
  },
  {
    q: 'How long does it take?',
    a: 'The site ships in a few weeks. SEO compounds over months, and we show you the curve in Search Console as it happens.',
  },
  {
    q: 'Is it WordPress?',
    a: 'No. Everything is hand-coded in Next.js. Faster, safer, and nothing to plug in, patch, or pay for monthly.',
  },
  {
    q: 'Can you do SEO on my existing site?',
    a: "Sometimes. If the site itself is the problem, we'll tell you straight and quote a rebuild instead of billing you to polish it.",
  },
  {
    q: 'Am I signing a contract?',
    a: 'No. And if you ever leave, everything goes with you: domain, code, content, data, all of it.',
  },
];

const PARTNERS = [
  {
    who: 'Dustyn Reno',
    role: 'Founder & lead designer',
    p: "Builds every site end to end. His own studio is Napkin's live proving ground.",
  },
  {
    who: 'Rocky Encarnation',
    role: 'Partner',
    p: 'One of the three people who will actually answer your email.',
  },
  {
    who: 'Tony Zuppardo',
    role: 'Partner',
    p: 'No account managers between you and him.',
  },
];

const DELAY = ['', ' d1', ' d2', ' d3'];

export default function Home() {
  return (
    <main id="main">
      {/* ============ HERO ============ */}
      <section className="hero wrap" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="headline">
              <HeroEcho />
              <h1 className="display">
                <HeadlineLockup
                  note
                  wrap={(line, i) => (
                    <span className="line" key={i}>
                      <span className="line-in">{line}</span>
                    </span>
                  )}
                />
              </h1>
            </div>
            <p className="hero-sub">
              Web design &amp; SEO that takes you from napkin sketch to ranking on Google.
            </p>
            <div className="hero-cta">
              <a className="btn btn-ink" href={MAILTO_NEW_PROJECT}>
                Start a project <span className="arrow">→</span>
              </a>
              <a className="btn btn-glass glass refract" href="#work">
                <span className="sheen" />
                See the work
              </a>
            </div>
            <p className="hero-receipt mono">
              <span className="dot" aria-hidden="true" />
              Real receipt · <b>0 → 29,885</b> Google impressions on our own site, first 4 months
            </p>
          </div>

          <div className="hero-object" aria-hidden="true">
            <div className="tilt">
              <div className="hero-keycap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/keycaps/seo.webp" alt="" width="620" height="611" />
                <span className="fig mono">the seo key, pressed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="meta-strip mono">
          <span className="live">
            Local <Clock />
          </span>
          <span>
            Hand-coded, <b>no page builders</b>
          </span>
          <span>
            <b>You own</b> everything
          </span>
          <span>
            <b>No</b> contracts
          </span>
          <span>
            Tested on <b>our own sites</b> first
          </span>
        </div>
      </section>
      <HeroTilt />

      {/* ============ RECEIPTS ============ */}
      <section className="wrap" id="receipts">
        <LogoField />
        <p className="eyebrow mono reveal">Real receipts</p>
        <h2 className="display section-head reveal">We ran the playbook on ourselves first.</h2>
        <div className="receipt-grid">
          <article className="receipt glass refract reveal">
            <span className="sheen" />
            <p className="num">
              0&thinsp;→&thinsp;<em>29,885</em>
            </p>
            <p className="what">Google impressions on our own build, starting from zero.</p>
            <p className="src mono">dustynrenodesign.com · Apr 2 to Jul 26, 2026</p>
          </article>
          <article className="receipt glass refract reveal d1">
            <span className="sheen" />
            <p className="num">
              Avg. pos. <em>7</em>
            </p>
            <p className="what">&ldquo;real estate photographer near me&rdquo;, sitting on page one.</p>
            <p className="src mono">Search Console · last 30 days</p>
          </article>
          <article className="receipt glass refract reveal d2">
            <span className="sheen" />
            <p className="num">
              Under <em>4</em> months
            </p>
            <p className="what">Brand-new domain. Zero backlink budget. Same playbook we sell.</p>
            <p className="src mono">Every number above is from Search Console</p>
          </article>
        </div>
        <p className="receipts-foot mono reveal">
          Evidence, not claims. If we can&#39;t measure it, we don&#39;t say it.
        </p>
      </section>

      {/* ============ WORK ============ */}
      <section className="wrap" id="work">
        <p className="eyebrow mono reveal">Selected work</p>
        <h2 className="display section-head reveal">Every project still has its napkin.</h2>
        <div className="work-grid">
          <button
            className="tile reveal"
            type="button"
            aria-expanded="false"
            aria-label="Dustyn Reno Design. Hover or tap to see the original napkin sketch"
          >
            <div className="final">
              <span className="art" aria-hidden="true">
                <svg viewBox="0 0 400 460" preserveAspectRatio="none">
                  <path
                    d="M40,380 L120,330 L190,350 L260,250 L330,150 L368,110"
                    fill="none"
                    stroke="rgba(122,147,255,.5)"
                    strokeWidth="2"
                  />
                  <circle cx="368" cy="110" r="5" fill="#7A93FF" />
                </svg>
              </span>
              <p className="tags mono">
                <span>Web</span>
                <span>SEO</span>
              </p>
              <h3 className="big">Dustyn Reno Design</h3>
              <p className="stat">0 → 29,885 impressions · the proving ground</p>
            </div>
            <div className="napkin-layer" aria-hidden="true">
              <p className="cap mono">
                <span>The napkin</span>
                <span>where it started</span>
              </p>
              <span className="sketch">
                <svg viewBox="0 0 340 300">
                  <path
                    pathLength={1}
                    d="M24,36 C110,30 240,32 316,36 C318,110 317,200 315,266 C230,272 110,270 26,266 C23,190 22,110 24,36 Z"
                  />
                  <path pathLength={1} d="M46,236 L46,120 M46,236 L300,236" />
                  <path
                    pathLength={1}
                    d="M58,224 C96,214 118,190 150,196 C186,203 200,150 236,132 C262,118 282,96 296,78"
                  />
                  <path pathLength={1} d="M296,78 l-14,2 M296,78 l-1,14" />
                  <circle pathLength={1} cx="296" cy="78" r="17" />
                  <path pathLength={1} d="M58,70 C90,64 130,66 158,70 M58,88 C84,84 104,86 122,88" />
                </svg>
              </span>
              <p className="cap mono">
                <span>sketched → shipped → ranking</span>
              </p>
            </div>
          </button>

          <button
            className="tile reveal d1"
            type="button"
            aria-expanded="false"
            aria-label="Infinity Glass and Glazing. Hover or tap to see the original napkin sketch"
          >
            <div className="final">
              <span className="art" aria-hidden="true">
                <svg viewBox="0 0 400 460" preserveAspectRatio="none">
                  <path
                    d="M60,90 L340,90 L340,400 L60,400 Z M200,90 L200,400 M60,245 L340,245"
                    fill="none"
                    stroke="rgba(242,239,230,.18)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M90,140 L150,110"
                    stroke="rgba(122,147,255,.55)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
              <p className="tags mono">
                <span>Web</span>
                <span>Brand</span>
              </p>
              <h3 className="big">Infinity Glass &amp; Glazing</h3>
              <p className="stat">A glass company&#39;s site. No pressure.</p>
            </div>
            <div className="napkin-layer" aria-hidden="true">
              <p className="cap mono">
                <span>The napkin</span>
                <span>where it started</span>
              </p>
              <span className="sketch">
                <svg viewBox="0 0 340 300">
                  <path
                    pathLength={1}
                    d="M40,40 C130,34 240,36 302,40 C305,110 304,190 302,258 C220,264 120,262 42,258 C39,190 38,110 40,40 Z"
                  />
                  <path
                    pathLength={1}
                    d="M170,42 C171,110 170,190 169,256 M42,148 C130,144 240,146 300,148"
                  />
                  <path
                    pathLength={1}
                    d="M66,110 C84,92 102,78 118,68 M66,132 C94,104 124,80 146,64"
                  />
                  <path pathLength={1} d="M226,196 C242,180 258,168 272,160" />
                  <path
                    pathLength={1}
                    d="M254,258 C255,224 254,208 255,196 C268,195 282,196 288,197 C289,220 288,240 288,258"
                  />
                </svg>
              </span>
              <p className="cap mono">
                <span>sketched → shipped → ranking</span>
              </p>
            </div>
          </button>

          <button
            className="tile reveal d2"
            type="button"
            aria-expanded="false"
            aria-label="Michael Morse Photography. Hover or tap to see the original napkin sketch"
          >
            <div className="final">
              <span className="art" aria-hidden="true">
                <svg viewBox="0 0 400 460" preserveAspectRatio="none">
                  <circle
                    cx="200"
                    cy="240"
                    r="120"
                    fill="none"
                    stroke="rgba(242,239,230,.16)"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="200"
                    cy="240"
                    r="74"
                    fill="none"
                    stroke="rgba(122,147,255,.45)"
                    strokeWidth="2"
                  />
                  <circle cx="200" cy="240" r="6" fill="#7A93FF" />
                </svg>
              </span>
              <p className="tags mono">
                <span>Web</span>
                <span>Photo</span>
              </p>
              <h3 className="big">Michael Morse Photography</h3>
              <p className="stat">The page-one photographer in the receipts.</p>
            </div>
            <div className="napkin-layer" aria-hidden="true">
              <p className="cap mono">
                <span>The napkin</span>
                <span>where it started</span>
              </p>
              <span className="sketch">
                <svg viewBox="0 0 340 300">
                  <path
                    pathLength={1}
                    d="M64,96 C140,90 230,92 280,96 C283,150 282,200 280,238 C210,244 130,242 66,238 C63,196 62,140 64,96 Z"
                  />
                  <path
                    pathLength={1}
                    d="M124,96 C130,84 138,76 148,72 C168,70 186,71 196,74 C204,80 210,88 214,96"
                  />
                  <circle pathLength={1} cx="172" cy="166" r="44" />
                  <circle pathLength={1} cx="172" cy="166" r="22" />
                  <path pathLength={1} d="M244,120 C252,118 258,118 264,120" />
                  <path pathLength={1} d="M28,46 l14,14 M42,46 l-14,14" />
                </svg>
              </span>
              <p className="cap mono">
                <span>sketched → shipped → ranking</span>
              </p>
            </div>
          </button>
        </div>
        <p className="work-hint mono">Tap a project to flip it over.</p>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee" aria-hidden="true">
        <div className="track">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              sketch it. <em>ship it.</em> rank it.
            </span>
          ))}
        </div>
      </div>

      {/* ============ SERVICES ============ */}
      <section className="wrap" id="services">
        <p className="eyebrow mono reveal">Services</p>
        <h2 className="display section-head reveal">Six ways we get it off the napkin.</h2>
        <ul className="svc-list" role="list">
          {SERVICES.map((s) => (
            <li className="svc reveal" key={s.idx}>
              <span className="idx">{s.idx}</span>
              <div className="name-wrap">
                <h3 className="name">
                  {s.name}
                  {s.core && <span className="core">Core</span>}
                </h3>
                <span className="scribble" aria-hidden="true">
                  <svg viewBox="0 0 300 12" preserveAspectRatio="none">
                    <path pathLength={1} d={s.scribble} />
                  </svg>
                </span>
              </div>
              <div className="plate glass refract">
                <span className="sheen" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.alt} width="74" height="74" loading="lazy" />
                <p>{s.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="wrap" id="process">
        <p className="eyebrow mono reveal">How we work</p>
        <h2 className="display section-head reveal">
          How does a napkin sketch become a business that ranks?
        </h2>
        <div className="steps">
          {PROCESS.map((step, i) => (
            <div className={`step reveal${DELAY[i]}`} key={step.h}>
              <p className="n">{step.n}</p>
              <h3>{step.h}</h3>
              <p>{step.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ GUARANTEE ============ */}
      <section className="wrap">
        <div className="guarantee-band">
          <div className="guarantee-copy">
            <p className="eyebrow mono reveal">Ownership</p>
            <h2 className="display section-head reveal" style={{ marginBottom: '1.2rem' }}>
              The no-lock-in guarantee.
            </h2>
            <p className="body-copy reveal">
              Agencies keep clients by holding the domain hostage. We&#39;d rather you stay because
              the numbers keep going up.
            </p>
            <a className="btn btn-ink reveal d1" href={MAILTO_FLAT_QUOTE}>
              Get a flat quote <span className="arrow">→</span>
            </a>
          </div>
          <div className="paper reveal d1">
            <h3>What&#39;s yours stays yours</h3>
            <ul>
              <li>Your domain, registered to you, not us.</li>
              <li>Your site and every line of its code.</li>
              <li>Your content, your photos, your data.</li>
              <li>No contracts. Leave whenever you like.</li>
            </ul>
            <p className="quote">
              &ldquo;We keep clients by being worth keeping, not by holding the keys.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ============ TEAM ============ */}
      <section className="wrap" id="team">
        <p className="eyebrow mono reveal">The people behind the work</p>
        <h2 className="display section-head reveal">Three partners. Zero hand-offs.</h2>
        <p className="team-line reveal">
          You email us, a partner replies. No account managers, no ticket queues. Every site has a
          named human behind it.
        </p>
        <div className="partners">
          {PARTNERS.map((p, i) => (
            <div className={`partner reveal${DELAY[i]}`} key={p.who}>
              <h3 className="who">{p.who}</h3>
              <p className="role mono">{p.role}</p>
              <p>{p.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="wrap" id="faq">
        <p className="eyebrow mono reveal">Questions we get on the first call</p>
        <h2 className="display section-head reveal">Ask us anything.</h2>
        <div className="faq reveal">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q} <span className="plus" aria-hidden="true" />
              </summary>
              <p className="a">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta wrap">
        <div className="inner">
          <div>
            <h2 className="display reveal">
              Got a napkin? <span className="pen">We&#39;ve got a pen.</span>
            </h2>
            <p className="sub mono reveal d1">
              Press the key. It emails us. A partner replies, not a queue.
            </p>
          </div>
          <div className="keycap-wrap reveal d1">
            <a
              className="keycap-btn"
              href={MAILTO_LETS_GO}
              aria-label="Let's go. Email Napkin Design Co to start a project"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/keycaps/cta.webp"
                alt="Orange keyboard keycap printed with LET'S GO and a lit cartoon bomb"
                width="320"
                height="318"
              />
              <span className="under mono">contact@napkindesign.co</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
