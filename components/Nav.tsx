import { WORDMARK_VIEWBOX } from './logo-paths';
import { MAILTO, MAILTO_NEW_PROJECT } from './links';

export default function Nav() {
  return (
    <header className="nav glass" id="nav" style={{ opacity: 0 }}>
      <a className="lockup" href="#top" aria-label="Napkin Design Co. home">
        <svg role="img" aria-hidden="true" viewBox={WORDMARK_VIEWBOX}>
          <use href="#wordmark" />
        </svg>
      </a>
      <nav aria-label="Primary">
        <ul className="nav-links mono">
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#team">Team</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
      </nav>
      <div className="nav-right">
        <a className="nav-mail mono" href={MAILTO}>
          contact@napkindesign.co
        </a>
        <a className="btn btn-glass glass refract" href={MAILTO_NEW_PROJECT}>
          <span className="sheen" />
          Start a project <span className="arrow">→</span>
        </a>
      </div>
    </header>
  );
}
