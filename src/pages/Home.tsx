import { useEffect } from "react";
import '../css/acceuil.css'

import Cabane from '../assets/images/image-cabane.jpg'
import At1 from '../assets/images/atelier1.jpg'
import At2 from '../assets/images/at2.jpg'
import At3 from '../assets/images/at3.jpg'

export const Home = () => {
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
    <>
      <section class="présentation" style="z-index: 0;">
        <div class="texte" style="z-index: 3;">
          <h1>Reservez votre visite au Centre ecologique</h1>
          <h4> Une immersion unique dans la nature </h4>
        </div>
        <div class="diapo" style="z-index: 1;">
          <img src={Cabane} alt="img1" />
        </div>
      </section>
      <section class="choi-parcourt">
        <div class="text-intro">
          <h1>CHOISISSEZ VOTRE EXPERIENCE</h1>
          <p>Des options variés pour tous les goûts</p>
        </div>
        <div class="choix">
          <article class="decouverte">
            <div class="haut">
              <img src={At2} alt="hh" />
            </div>
            <div class="bas">
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
          <article class="educatif">
            <div class="haut">
              <img src={At1} alt="DF" />
            </div>

            <div class="bas">
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
          <article class="thématique">
            <div class="haut">
              <img src={At3} alt="erreur" />
            </div>

            <div class="bas">
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

      <section class="planifier">
        <div class="text-intro">
          <h1>PLANIFIER VOTRE VISITE DES MAINTENANT</h1>
          <p>
            Decouvrez notre environnement exceptionnnel et engagez-vous pour la
            planete{" "}
          </p>
        </div>
        <div class="reserver">
          <div class="reserv-g">
            <img src={Cabane} alt="arreur" />
          </div>
          <div class="reserv-d">
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
            <div class="boutton">
              <h2>
                <a href="Formulaire.html">Reserver </a>
              </h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
