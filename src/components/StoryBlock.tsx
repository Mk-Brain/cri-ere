import type { ReactNode } from "react";

type StoryBlockProps = {
  title: string;
  image?: string;
  alt?: string;
  children: ReactNode;
};

export const StoryBlock = ({
  title,
  image,
  alt = "illustration",
  children,
}: StoryBlockProps) => {
  return (
    <div className="story-card">
      <h4 className="story-card-title">{title}</h4>
      {image ? (
        <img src={image} alt={alt} className="story-card-image" />
      ) : null}
      {children}
      <br />
    </div>
  );
};
