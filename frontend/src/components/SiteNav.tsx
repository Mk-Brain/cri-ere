import { useLocation } from "preact-iso";
import { useState } from "preact/hooks";

import Logo from "../assets/images/logo4.png";

export const SiteNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { path } = useLocation();

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/infos", label: "À propos" },
    { href: "/reservation", label: "Réservation" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => path === href;

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navigation principale">
        <div className="site-nav-group site-nav-left">
          {links.slice(0, 2).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`site-nav-link ${isActive(link.href) ? "active" : ""}`}
            >
              {link.label}
            </a>
          ))}
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
          {links.slice(2).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`site-nav-link ${isActive(link.href) ? "active" : ""}`}
            >
              {link.label}
            </a>
          ))}
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
          <a
            key={link.href}
            href={link.href}
            className={`site-nav-mobile-link ${isActive(link.href) ? "active" : ""}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
};
