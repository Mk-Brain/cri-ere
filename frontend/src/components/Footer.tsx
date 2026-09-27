import Logo from "../assets/images/logo4.png";

const footerLinks = [
  { href: "/", label: "Accueil" },
  { href: "/infos", label: "A propos du centre" },
  { href: "/reservation", label: "Prenez rendez-vous" },
  { href: "/contact", label: "Laisser un message" },
];

const contactLinks = [
  { href: "#", label: "...@gmail.com" },
  { href: "#", label: "+237 22-21-26-90" },
  { href: "#", label: "Fax: 22-20-53-24" },
];

const socialLinks = [
  { href: "#", label: "Facebook" },
  { href: "#", label: "Twitter" },
  { href: "#", label: "Instagram" },
  { href: "#", label: "YouTube" },
  { href: "#", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <div className="footer-box-shell">
      <div className="footer-box">
        <div className="footer-box-grid">
          <div className="footer-box-column footer-box-brand">
            <img
              src={Logo}
              alt="CRI-ERE logo emblem representing the organization"
              className="footer-box-logo"
            />
            <h3>CRI-ERE</h3>
          </div>

          <div className="footer-box-column">
            <h3>Liens rapides</h3>
            <ul className="footer-box-links">
              {footerLinks.map((link) => (
                <li key={link.href} className="footer-box-link-item">
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-box-column">
            <h3>Contacts</h3>
            <ul className="footer-box-links">
              {contactLinks.map((link) => (
                <li key={link.label} className="footer-box-link-item">
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-box-column">
            <h3>Suivez notre université</h3>
            <ul className="footer-box-links">
              {socialLinks.map((link) => (
                <li key={link.label} className="footer-box-link-item">
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
