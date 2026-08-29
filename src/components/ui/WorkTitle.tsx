type WorkTitleProps = {
  title: string;
};

export function WorkTitle({ title }: WorkTitleProps) {
  const [series, episode] = title.split(" - ");

  if (!episode) return <>{title}</>;

  return (
    <>
      {series}
      <span className="work-title-episode">{episode}</span>
    </>
  );
}
