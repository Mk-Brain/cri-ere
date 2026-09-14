import { useEffect } from "react";
import "../css/contact.css";

import Portail from "../assets/images/portail.jpg";
import Horloge from "../assets/images/horloge.png";
import Telephone from "../assets/images/Téléphone fixe.png";
import Logo from "../assets/images/logo4.png";
import Arbuste from "../assets/images/image-arbuste.jpg";

export const Contact = () => {
  useEffect(() => {
    const toggle = document.getElementById("navbarToggle");
    const links = document.getElementById("navbarLinks");
    toggle?.addEventListener("click", () => {
      links!.style.width = "1px";
      links!.classList.toggle("active");
      let taille = 1;
      setInterval(() => {
        if (taille <= 300) {
          taille += 55;
          links!.style.width = taille + "px";
        }
      }, 100);
    });
  }, []);

  return (
    <div>
      <section className="présentation">
        <div className="texte" style={{ zIndex: 1 }}>
          <h1>Bienvenue au Centre Ecologique</h1>
          <h4>Votre lien direct avec le centre ecologique</h4>
        </div>
        <div className="diapo" style={{ zIndex: 0 }}>
          <img src={Arbuste} alt="img1" />
        </div>
      </section>

      <section className="info">
        <div className="inf-partique">
          <h1>Informations Pratique</h1>
          <p>Nous sommes là pour vous aider</p>
        </div>
        <div className="precisions">
          <div className="detail">
            <div className="haut">
              <img src={Portail} alt="erreur" />
            </div>
            <div className="bas">
              <h3>localisation</h3>
              <p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.685918046198!2d11.519889209695664!3d3.8773629960801372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7d2c105df3%3A0x5ea00e14c725e8db!2sUniversit%C3%A9%20Protestante%20d&#39;Afrique%20Centrale%20(UPAC)!5e0!3m2!1sfr!2sus!4v1747069516395!5m2!1sfr!2sus"
                  width="315"
                  height="180"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </p>
            </div>
          </div>
          <div className="detail">
            <div className="haut">
              <img src={Horloge} alt="erreur" />
            </div>
            <div className="bas">
              <h3>Horaires d'ouverture</h3>
              <ul>
                <li style={{ margin: "0px" }}>LUNDI : De 8h-14h </li>
                <li>MARDI : De 8h-14h</li>
                <li>MERCREDI : De 8h-14h</li>
                <li>JEUDI : De 8h-14h</li>
                <li>VENDREDI : De 8h-14h</li>
                <li>SAMEDI : De 8h-16h30</li>
              </ul>
            </div>
          </div>
          <div className="detail">
            <div className="haut">
              <img src={Telephone} alt="erreur" />
            </div>
            <div className="bas">
              <h3>Moyens de contact</h3>
              <ul>
                <li>B.P.4011 Yaoundé-Cameroun </li>
                <li>Tel : +(237) 22-21-26-90</li>
                <li>Fax : +(237) 22-20-53-24</li>
                <li>email : HubNAFEVAD-CRI-ERE@gmail.com</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="form_contact">
        <h1>Formulaire de conctact</h1>
        <div className="text-form_contact">
          <p>Nous somme à votre écoute</p>
        </div>
        <div className="form">
          <form action="" method="post">
            <input type="text" name="nom" placeholder="Nom" />
            <input type="email" name="email" placeholder="E-mail" />
            <textarea
              rows={2}
              cols={3}
              name="message"
              id="message"
              placeholder="Message"
            ></textarea>
            <button type="submit">Soumettre</button>
          </form>
        </div>
      </section>

      <div className="container">
        <footer className="pdp">
          <h1>
            Centre de Recherche Intégrées en Education Relative à
            l'environnement
          </h1>
          <div className="colmb-3"></div>
          <pre
            id="elements"
            className="elements d-flex flex-column flex-md-row"
          >
            <div id="c1" className="colmb-31">
              <div id="logo">
                <img src={Logo} alt="erreur" />
              </div>
              <h3 id="title">CRI-ERE</h3>
            </div>
            <div id="c2" className="colmb-3">
              <h3>Liens rapides</h3>
              <ul className="navflex-column">
                <li className="nav-item mb-2">
                  <a href="acceuil.html">Acceuil</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#A_propos.html">A propos du centre</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="reservation.html">Prenez rendez-vous</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="contact.html">laisser un message</a>
                </li>
              </ul>
            </div>

            <div id="c3" className="colmb-3">
              <h3>Contacts</h3>
              <ul className="navflex-column">
                <li className="nav-item mb-2">
                  <a href="#">...@gmail.com</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#">+237 22-21-26-90</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#">Fax: 22-20-53-24</a>
                </li>
              </ul>
            </div>

            <div id="c4" className="colmb-3">
              <h3>Suivez notre université</h3>
              <ul className="navflex-column">
                <li className="nav-item mb-2">
                  <a href="#">facebook</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#">tweter</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#">instagram</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#">Youtube</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#">linkdin</a>
                </li>
              </ul>
            </div>
          </pre>
        </footer>
      </div>
    </div>
  );
};
