import type { ReactNode } from "react";

type DetailCardProps = {
  title: string;
  image: string;
  alt?: string;
  children: ReactNode;
  className?: string;
};

export const DetailCard = ({
  title,
  image,
  alt = "illustration",
  children,
  className = "info-card",
}: DetailCardProps) => {
  return (
    <div className={`info-card ${className}`}>
      <div className="info-card-media">
        <img src={image} alt={alt} />
      </div>
      <div className="info-card-body">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
};
