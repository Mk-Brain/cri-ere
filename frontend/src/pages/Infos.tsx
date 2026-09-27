import "../css/a_propos.css";
import Image1 from "../assets/images/image-upac-amour-paix1.jpg";
import Image2 from "../assets/images/image-paroi-en-bouteille-H.jpg";

import { StoryBlock } from "../components/StoryBlock";

export const Infos = () => {
  return (
    <>
      <div className="story-header">
        <h1>CHOISSISSEZ VOTRE EXPERIENCE</h1>
        <h3> Plusieurs option pour une meilleur aventutre</h3>
      </div>

      <div className="history-section">
        <h4 className="section-title">HISTORIQUE</h4>
        <p>
          Depuit l'an 2018, l' Université Protestante d'Afrique centrale (UPAC)
          a mis sur pied un programme des conférences inter facultaires sur le
          Centre de Recherche Intégrées en Education Relative à l'environnement.
          CRI-ERE de l'UPAC est un cadre d'acceuil scientifique qui a pour
          mission de contribué au développement d' une société qui s'engage à
          améliorer le réseau des relations entre les personnes, les groupes
          sociaux et l'environnement, en dynamisant le champ de recherche en
          éducation relative à l'environnement.
        </p>
        <br />

        <h4 className="section-title">Presentation</h4>
        <p>
          Dans ses activités, le CRI-ERE oeuvre avec les milieux d'éducation
          formelle et d'apprentissage informel. Parce que l'éducation doit
          permettre aux individus d'apprendre à vivre individuellement et
          collectivement, le CRI-ERE se doit de permettre d'appréhendé de
          comprendre et de réagir aux problématiques environnementales de notre
          temps. Il ne s'agit pas de faire culpabiliser mais putôt de faire
          refléchire aux différentes possibilités et ainsi agir ensemble.
        </p>
      </div>

      <StoryBlock title="Notre mission" image={Image1} alt="image_du_guide_2">
        <p>
          La mission du Centre est développer, conformement à la politique de
          l'universit&, la recherche-creation où l'action simpose à travers les
          axes stratégiques prioritaires: ¤ Religion, Culture, Environnement et
          développement <br />
          ¤ Agriculture et Environnement <br />
          ¤ Technologie et Environnement <br />
          ¤ Securité alimentaire, Environnement et développement <br />
          ¤ Paix, justice et Environnement <br />
          ¤ Adaptation au changement climatique <br />
          ¤ Genie de l'Environnement <br />
          ¤ Matériaux et applications <br />
          ¤ Hygiène, Culture, Santé et Environnement <br />
          ¤ Technologie, Ecologie, et développement <br />
        </p>
      </StoryBlock>

      <StoryBlock title="ESPACE VERT" image={Image2} alt="image_du_guide_3">
        <p>
          venez decouvrir nos espaces verts , ideale pour vous liberez les idees
          tout en profitant de la vue splandide! Ne manquez pas cette chance de
          vous epanouir
        </p>
      </StoryBlock>

      <a href="#boutton">
        <abbr title="Remontez au debut de la page !">
          <button className="back-to-top">
            &#9650;
            <br />
            BACK UP
          </button>
        </abbr>
      </a>
    </>
  );
};
