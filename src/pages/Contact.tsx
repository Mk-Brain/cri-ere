import "../css/contact.css";

import Portail from "../assets/images/portail.jpg";
import Horloge from "../assets/images/horloge.png";
import Telephone from "../assets/images/Téléphone fixe.png";
import Arbuste from "../assets/images/image-arbuste.jpg";

import { DetailCard } from "../components/DetailCard";
import { PageHero } from "../components/PageHero";

export const Contact = () => {
  const informations = [
    {
      title: "localisation",
      image: Portail,
      alt: "localisation",
      content: (
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
      ),
    },
    {
      title: "Horaires d'ouverture",
      image: Horloge,
      alt: "horaires",
      content: (
        <ul>
          <li style={{ margin: "0px" }}>LUNDI : De 8h-14h </li>
          <li>MARDI : De 8h-14h</li>
          <li>MERCREDI : De 8h-14h</li>
          <li>JEUDI : De 8h-14h</li>
          <li>VENDREDI : De 8h-14h</li>
          <li>SAMEDI : De 8h-16h30</li>
        </ul>
      ),
    },
    {
      title: "Moyens de contact",
      image: Telephone,
      alt: "contact",
      content: (
        <ul>
          <li>B.P.4011 Yaoundé-Cameroun </li>
          <li>Tel : +(237) 22-21-26-90</li>
          <li>Fax : +(237) 22-20-53-24</li>
          <li>email : HubNAFEVAD-CRI-ERE@gmail.com</li>
        </ul>
      ),
    },
  ];

  return (
    <div>
      <PageHero
        title="Bienvenue au Centre Ecologique"
        subtitle="Votre lien direct avec le centre ecologique"
        image={Arbuste}
        alt="centre écologique"
      />

      <section className="contact-section">
        <div className="contact-intro">
          <h1>Informations Pratique</h1>
          <p>Nous sommes là pour vous aider</p>
        </div>
        <div className="contact-grid">
          {informations.map((item) => (
            <DetailCard
              key={item.title}
              title={item.title}
              image={item.image}
              alt={item.alt}
            >
              {item.content}
            </DetailCard>
          ))}
        </div>
      </section>

      <section className="contact-form-section">
        <h1>Formulaire de contact</h1>
        <div className="contact-form-intro">
          <p>Nous somme à votre écoute</p>
        </div>
        <div className="contact-form-wrap">
          <form className="contact-form" action="" method="post">
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
    </div>
  );
};
