import "../css/contact.css";

import Portail from "../assets/images/portail.jpg";
import Horloge from "../assets/images/horloge.png";
import Telephone from "../assets/images/Téléphone fixe.png";
import Arbuste from "../assets/images/image-arbuste.jpg";

import { DetailCard } from "../components/DetailCard";
import { PageHero } from "../components/PageHero";
import { useState, type JSX } from "preact/compat";
import { sendContactMessage } from "../services/reservation";
import type { VisitorMessage } from "../types/DomainTypes";


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

export const Contact = () => {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (
    event: JSX.TargetedEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitError(null);
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const messageData: VisitorMessage = {
      nom: String(formData.get("nom") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      contenu: String(formData.get("contenu") ?? "").trim(),
    };

    try {
      const result = await sendContactMessage(messageData);
      setMessage(result.message);
      formElement.reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Le message n’a pas pu être envoyé. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  
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
        {submitError && (
            <p className="form-feedback form-feedback--error" role="alert">
              {submitError}
            </p>
          )}
          {message && (
            <p className="form-feedback form-feedback--success" role="status">
              {message}
            </p>
          )}
        <div className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" name="nom" placeholder="Nom" />
            <input type="email" name="email" placeholder="E-mail" />
            <textarea
              rows={2}
              cols={3}
              name="contenu"
              id="message"
              placeholder="Message"
            ></textarea>
            <button type="submit" disabled={isSubmitting}>Soumettre</button>
          </form>
        </div>
      </section>
    </div>
  );
};
