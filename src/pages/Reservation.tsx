import { useEffect } from "react";
import "../css/reservation.css";

import Cabane from "../assets/images/image-cabane.jpg";
import At1 from "../assets/images/atelier1.jpg";
import At2 from "../assets/images/at2.jpg";
import At3 from "../assets/images/at3.jpg";

export const Reservation = () => {
  useEffect(() => {
    const toggle = document.getElementById("navbarToggle");
    const links = document.getElementById("navbarLinks");
    toggle?.addEventListener("click", () => {
      links!.style.width = "1px";
      links!.classList.toggle("active");
      var taille = 1;
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
      <div className="entete">
        <nav className="navbar">
          <div className="navbar-logo">CRI-ERE</div>
          <ul style="z-index: 100;" className="navbar-links" id="navbarLinks">
            <li>
              <a href="acceuil.html">Accueil</a>
            </li>
            <li>
              <a href="A_propos.html">À propos</a>
            </li>
            <li>
              <a href="reservation.html">Reservation</a>
            </li>
            <li>
              <a href="contact.html">Contact</a>
            </li>
          </ul>
          <div className="navbar-toggle" id="navbarToggle">
            &#9776;
          </div>
        </nav>
      </div>

      <section className="présentation" style="z-index: 0;">
        <div className="texte" style="z-index: 3;">
          <h1>Reservez votre visite au Centre ecologique</h1>
          <h4> Une immersion unique dans la nature </h4>
        </div>
        <div className="diapo" style="z-index: 1;">
          <img src={Cabane} alt="img1" />
        </div>
      </section>
      <section className="choi-parcourt">
        <div className="text-intro">
          <h1>CHOISISSEZ VOTRE EXPERIENCE</h1>
          <p>Des options variés pour tous les goûts</p>
        </div>
        <div className="choix">
          <article className="decouverte">
            <div className="haut">
              <img src={At2} alt="hh" />
            </div>
            <div className="bas">
              <h3>visite découverte</h3>
              <p>
                Cet atelier vous fait découvrir des initiatives innoventes pour
                reduire notre impact sur la planete, des méthodes de récyclage
                et de gestion des dechets aux techniques de production d'energie
                renouvelables. Preparez-vous à être inspirés et à apprendre
                comment nous pouvons tous contribuer à protéger notre planete !
              </p>
            </div>
          </article>
          <article className="educatif">
            <div className="haut">
              <img src={At1} alt="DF" />
            </div>

            <div className="bas">
              <h3>Atelier éducatif</h3>
              <p>
                Cet atelier immersif vous permet de comprendre et d'expérimenter
                les techniques de construction ecologiques. avec un
                accompagnement de qualité, vous decouvrirez les étapes de
                transfomation et de mise en oeuvre de ces matériaux alternatifs.
                une experienceenrichissante qui mêle savoir-faire technique et
                sensibilisation à l'environnement
              </p>
            </div>
          </article>
          <article className="thématique">
            <div className="haut">
              <img src={At3} alt="erreur" />
            </div>

            <div className="bas">
              <h3>visite thématique</h3>
              <p>
                Cette visite thématique vous plonge dans un parcout spécifique
                mettant en lumière les aspects techniques, environnementaux et
                sociaux du recyclage. Que vous soyez passionné d'architechture
                durable, curieux d'en apprendre plus sur le recyclage, ou
                simplement à la recherche d'une visite hors du commun, ce
                parcourt vous apportera des connaissances précieuses et une
                nouvelles vision de l'eco-construction
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="planifier">
        <div className="text-intro">
          <h1>PLANIFIER VOTRE VISITE DES MAINTENANT</h1>
          <p>
            Decouvrez notre environnement exceptionnnel et engagez-vous pour la
            planete{" "}
          </p>
        </div>
        <div className="reserver">
          <div className="reserv-g">
            <img src={Cabane} alt="arreur" />
          </div>
          <div className="reserv-d">
            <h3>Horaire de VISITE</h3>
            <p>
              En fonction des differentes activités l UPAC vous ouvre ses portes
              , pour une experience riche en decouverte ,en apprentissage et
              surtout pour vous divertir Bien vouloir respecter les heures de
              pointe pour eviter les désagrements
            </p>
            <br />
            <h3>JOURS OUVRABLES</h3>
            <ul>
              <li>LUNDI : De 8h-14h </li>
              <li>MARDI : De 8h-14h</li>
              <li>MERCREDI : De 8h-14h</li>
              <li>JEUDI : De 8h-14h</li>
              <li>VENDREDI : De 8h-14h</li>
              <li>SAMEDI : De 8h-16h30</li>
            </ul>
            <div className="boutton">
              <h2>
                <a href="Formulaire.html">Reserver </a>
              </h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
