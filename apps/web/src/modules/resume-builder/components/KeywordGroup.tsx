type Props = {
  title: string;
  keywords: string[];
};

export default function KeywordGroup({ title, keywords }: Props) {
  if (keywords.length === 0) return null;

  return (
    <div className="ats-panel__keyword-group">
      <span className="ats-panel__keyword-group-title">{title}</span>

      <div className="ats-panel__keywords">
        {keywords.map((keyword) => (
          <span key={keyword} className="ats-panel__tag">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}