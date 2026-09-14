import Logo from "../assets/images/logo4.png";

export const Footer = () => {
  return (
    <div class="container">
      <footer class="pdp">
        <h1>
          Centre de Recherche Intégrées en Education Relative à l'environnement
        </h1>
        <div class="colmb-3"></div>
        <pre id="elements" class="elements d-flex flex-column flex-md-row">
          <div id="c1" class="colmb-31">
            <div id="logo">
              <img
                src={Logo}
                alt="CRI-ERE logo emblem representing the organization"
                className="logo"
              />
            </div>
            <h3 id="title">CRI-ERE</h3>
          </div>
          <div id="c2" class="colmb-3">
            <h3>Liens rapides</h3>
            <ul class="navflex-column">
              <li class="nav-item mb-2">
                <a href="acceuil.html">Acceuil</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#A_propos.html">A propos du centre</a>
              </li>
              <li class="nav-item mb-2">
                <a href="reservation.html">Prenez rendez-vous</a>
              </li>
              <li class="nav-item mb-2">
                <a href="contact.html">laisser un message</a>
              </li>
            </ul>
          </div>

          <div id="c3" class="colmb-3">
            <h3>Contacts</h3>
            <ul class="navflex-column">
              <li class="nav-item mb-2">
                <a href="#">...@gmail.com</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#">+237 22-21-26-90</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#">Fax: 22-20-53-24</a>
              </li>
            </ul>
          </div>

          <div id="c4" class="colmb-3">
            <h3>Suivez notre université</h3>
            <ul class="navflex-column">
              <li class="nav-item mb-2">
                <a href="#">facebook</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#">tweter</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#">instagram</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#">Youtube</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#">linkdin</a>
              </li>
            </ul>
          </div>
        </pre>
      </footer>
    </div>
  );
};
