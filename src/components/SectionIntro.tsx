type SectionIntroProps = {
  title: string;
  text?: string;
};

export const SectionIntro = ({ title, text }: SectionIntroProps) => {
  return (
    <div className="section-intro">
      <h1>{title}</h1>
      {text ? <p>{text}</p> : null}
    </div>
  );
};
