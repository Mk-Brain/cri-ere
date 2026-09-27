type SectionIntroProps = {
  title: string;
  text?: string;
};

export const SectionIntro = ({ title, text }: SectionIntroProps) => {
  return (
    <div className=" contact-intro mt-5 mb-5">
      <h1>{title}</h1>
      {text ? <p>{text}</p> : null}
    </div>
  );
};
