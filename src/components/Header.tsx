import { useEffect } from "react";
import Logo from "../assets/images/logo4.png";

export const Header = () => {
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
    <div>
      <header>
        <div class="gauche">
          <a href="/" class="acceuil">
            <button>Acceuil</button>
          </a>
          <a href="/infos" class="a_propos">
            <button>A propos</button>
          </a>
        </div>
        <div class="milieu">
          <img
            src={Logo}
            alt="CRI-ERE logo emblem representing the organization"
            className="logo"
          />
          <h1 class="titre">CRI-ERE</h1>
        </div>
        <div class="droite">
          <a href="/reservation" class="reservation">
            <button>reservation</button>
          </a>
          <a href="/contact" class="contact">
            <button>Contact</button>
          </a>
        </div>
      </header>
    </div>
    <div class="entete">
        <nav class="navbar">
          <div class="navbar-logo">CRI-ERE</div>
          <ul style="z-index: 100;" class="navbar-links" id="navbarLinks">
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
          <div class="navbar-toggle" id="navbarToggle">
            &#9776;
          </div>
        </nav>
      </div></>
  );
};
