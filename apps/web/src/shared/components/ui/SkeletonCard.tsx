import "./SkeletonCard.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__line skeleton-card__line--title" />
      <div className="skeleton-card__line skeleton-card__line--text" />
      <div className="skeleton-card__line skeleton-card__line--text short" />
    </div>
  );
}