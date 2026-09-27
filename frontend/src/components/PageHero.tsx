type PageHeroProps = {
  title: string;
  subtitle?: string;
  image?: string;
  alt?: string;
};

export const PageHero = ({
  title,
  subtitle,
  image,
  alt = "Illustration",
}: PageHeroProps) => {
  return (
    <section className="hero-section">
      <div className="hero-content" style={{ zIndex: 3 }}>
        <h1 className="hero-title">{title}</h1>
        {subtitle ? <h4 className="hero-subtitle">{subtitle}</h4> : null}
      </div>

      {image ? (
        <div className="hero-media" style={{ zIndex: 1 }}>
          <img src={image} alt={alt} className="hero-image" />
        </div>
      ) : null}
    </section>
  );
};
