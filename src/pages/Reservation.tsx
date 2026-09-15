import "../css/reservation.css";

import Cabane from "../assets/images/image-cabane.jpg";
import At1 from "../assets/images/atelier1.jpg";
import At2 from "../assets/images/at2.jpg";
import At3 from "../assets/images/at3.jpg";

import { PageHero } from "../components/PageHero";
import { SectionIntro } from "../components/SectionIntro";
import { ExperienceCard } from "../components/ExperienceCard";

export const Reservation = () => {
  const experiences = [
    {
      title: "visite découverte",
      description:
        "Cet atelier vous fait découvrir des initiatives innoventes pour reduire notre impact sur la planete, des méthodes de récyclage et de gestion des dechets aux techniques de production d'energie renouvelables. Preparez-vous à être inspirés et à apprendre comment nous pouvons tous contribuer à protéger notre planete !",
      image: At2,
      alt: "visite découverte",
      className: "decouverte",
    },
    {
      title: "Atelier éducatif",
      description:
        "Cet atelier immersif vous permet de comprendre et d'expérimenter les techniques de construction ecologiques. avec un accompagnement de qualité, vous decouvrirez les étapes de transfomation et de mise en oeuvre de ces matériaux alternatifs. une experienceenrichissante qui mêle savoir-faire technique et sensibilisation à l'environnement",
      image: At1,
      alt: "atelier éducatif",
      className: "educatif",
    },
    {
      title: "visite thématique",
      description:
        "Cette visite thématique vous plonge dans un parcout spécifique mettant en lumière les aspects techniques, environnementaux et sociaux du recyclage. Que vous soyez passionné d'architechture durable, curieux d'en apprendre plus sur le recyclage, ou simplement à la recherche d'une visite hors du commun, ce parcourt vous apportera des connaissances précieuses et une nouvelles vision de l'eco-construction",
      image: At3,
      alt: "visite thématique",
      className: "thématique",
    },
  ];

  return (
    <div>
      <PageHero
        title="Reservez votre visite au Centre ecologique"
        subtitle="Une immersion unique dans la nature"
        image={Cabane}
        alt="centre écologique"
      />

      <section className="experience-section">
        <SectionIntro
          title="CHOISISSEZ VOTRE EXPERIENCE"
          text="Des options variés pour tous les goûts"
        />

        <div className="experience-grid">
          {experiences.map((item) => (
            <ExperienceCard
              key={item.title}
              title={item.title}
              description={item.description}
              image={item.image}
              alt={item.alt}
              className={item.className}
            />
          ))}
        </div>
      </section>

      <section className="visit-section">
        <SectionIntro
          title="PLANIFIER VOTRE VISITE DES MAINTENANT"
          text="Decouvrez notre environnement exceptionnnel et engagez-vous pour la planete"
        />

        <div className="visit-layout">
          <div className="visit-image">
            <img src={Cabane} alt="arreur" />
          </div>
          <div className="visit-content">
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
            <div className="primary-button">
              <a href="/formulaire">Reserver</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
