import {
  CCarousel,
  CCarouselCaption,
  CCarouselItem,
  CImage,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

import Cabane from "../assets/images/image-cabane.jpg";
import At1 from "../assets/images/atelier1.jpg";
import At2 from "../assets/images/at2.jpg";

export const Carousel = () => {
  const slides = [
    {
      src: Cabane,
      alt: "slide 1",
      title:
        "Centre de Recherche Intégrées en Education Relative à l'environnement",
      subtitle: "Une immersion unique dans la nature",
    },
    {
      src: At1,
      alt: "slide 2",
      title:
        "Centre de Recherche Intégrées en Education Relative à l'environnement",
      subtitle: "Une immersion unique dans la nature",
    },
    {
      src: At2,
      alt: "slide 3",
      title:
        "Centre de Recherche Intégrées en Education Relative à l'environnement",
      subtitle: "Une immersion unique dans la nature",
    },
  ];

  return (
    <CCarousel
      controls
      indicators
      interval={3000}
      className="home-carousel"
      style={{ position: "relative", zIndex: 2 }}
    >
      {slides.map((slide) => (
        <CCarouselItem className="h-50" key={slide.alt}>
          <CImage
            className="d-block w-100"
            src={slide.src}
            alt={slide.alt}
            style={{ height: "75vh", objectFit: "cover" }}
          />

          <CCarouselCaption className="d-none d-md-block">
            <div
              style={{
                position: "absolute",
                inset: "auto 12% 36px 12%",
                background: "rgba(12, 29, 22, 0.44)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                padding: "0.8rem 1rem",
                textShadow: "0 2px 10px rgba(0,0,0,0.45)",
                backdropFilter: "blur(3px)",
              }}
            >
              <h1 className="home-carousel-title">{slide.title}</h1>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  color: "#edf8f0",
                  textAlign: "center",
                  fontSize: "1rem",
                  letterSpacing: "0.03em",
                }}
              >
                {slide.subtitle}
              </p>
            </div>
          </CCarouselCaption>
        </CCarouselItem>
      ))}
    </CCarousel>
  );
};
