import "../css/Card.css";

export interface CardProps {
  label: string;
  title: string;
  description: string;
  borderColor: string;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  label,
  title,
  description,
  borderColor,
  icon,
  meta,
  className = "",
}) => (
  <div
    className={`dashboard-card ${className}`}
    style={{
      border: `3.5px solid ${borderColor}`,
      background: "#23232b", // theme-matching background
      color: "#fff"
    }}
  >
    <div className="dashboard-card-label">{label}</div>
    <div className="dashboard-card-title">{icon}{title}</div>
    <div className="dashboard-card-desc">
      {description.split("\n").map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
    {meta && <div className="dashboard-card-meta">{meta}</div>}
  </div>
);

export default Card;