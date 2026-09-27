type ExperienceCardProps = {
  title: string;
  description: string;
  image: string;
  alt?: string;
  className?: string;
};

export const ExperienceCard = ({
  title,
  description,
  image,
  alt = "illustration",
  className = "experience-card",
}: ExperienceCardProps) => {
  return (
    <article className={`experience-card ${className}`}>
      <div className="experience-card-media">
        <img src={image} alt={alt} />
      </div>
      <div className="experience-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
};
