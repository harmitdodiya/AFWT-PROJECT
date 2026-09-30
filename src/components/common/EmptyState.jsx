export default function EmptyState({ title = 'Nothing here yet', description }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}
