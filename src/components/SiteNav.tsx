import { useState } from "preact/hooks";

import Logo from "../assets/images/logo4.png";

export const SiteNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/infos", label: "À propos" },
    { href: "/reservation", label: "Réservation" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navigation principale">
        <div className="site-nav-group site-nav-left">
          <a href="/" className="site-nav-link">
            Accueil
          </a>
          <a href="/infos" className="site-nav-link">
            À propos
          </a>
        </div>

        <div className="site-brand">
          <img
            src={Logo}
            alt="CRI-ERE logo emblem representing the organization"
            className="site-brand-logo"
          />
          <h1 className="site-brand-title">CRI-ERE</h1>
        </div>

        <div className="site-nav-group site-nav-right">
          <a href="/reservation" className="site-nav-link">
            Réservation
          </a>
          <a href="/contact" className="site-nav-link">
            Contact
          </a>
        </div>
      </nav>
      <div className="mobile-header-row">
        <div className="mobile-brand" aria-label="Brand du site">
          <img
            src={Logo}
            alt="CRI-ERE logo emblem representing the organization"
            className="site-brand-logo"
          />
          <h1 className="site-brand-title">CRI-ERE</h1>
        </div>
        <button
          type="button"
          className="site-nav-toggle"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`site-nav-mobile ${isOpen ? "is-open" : ""}`}
        aria-label="Navigation mobile"
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} className="site-nav-mobile-link">
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
};
