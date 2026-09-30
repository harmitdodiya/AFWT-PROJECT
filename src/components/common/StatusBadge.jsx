const CLASS_MAP = {
  Pending: 'badge-pending',
  Confirmed: 'badge-confirmed',
  'In Progress': 'badge-inprogress',
  Completed: 'badge-completed',
  Cancelled: 'badge-cancelled',
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${CLASS_MAP[status] || ''}`}>{status}</span>;
}
