type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, description, as: Heading = "h2" }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <Heading>{title}</Heading>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}
