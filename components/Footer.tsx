import { WORDMARK_VIEWBOX } from './logo-paths';
import { MAILTO, MAILTO_NEW_PROJECT } from './links';

export default function Footer() {
  return (
    <footer className="wrap">
      <div className="foot-grid">
        <div className="foot-brand">
          <svg role="img" aria-label="Napkin Design Co" viewBox={WORDMARK_VIEWBOX}>
            <use href="#wordmark" />
          </svg>
          <p>
            Hand-coded websites and the SEO engine behind them, for small businesses that started as
            a sketch on a napkin.
          </p>
        </div>
        <nav className="foot-nav" aria-label="Footer">
          <ul>
            <li className="h mono">Site</li>
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#process">Process</a>
            </li>
            <li>
              <a href="#team">Team</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
          <ul>
            <li className="h mono">Contact</li>
            <li>
              <a href={MAILTO_NEW_PROJECT}>Start a project</a>
            </li>
            <li>
              <a href={MAILTO}>contact@napkindesign.co</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="colophon mono">
        <span>© 2026 Napkin Design Co.</span>
        <span className="tag">
          sketch it. <em>ship it.</em> rank it.
        </span>
        <span>Hand-coded. No page builders.</span>
      </div>
    </footer>
  );
}
