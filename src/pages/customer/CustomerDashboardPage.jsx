import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { fetchAppointments } from '../../store/slices/appointmentsSlice';

export default function CustomerDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: appointments } = useSelector((s) => s.appointments);

  useEffect(() => { dispatch(fetchAppointments()); }, [dispatch]);

  const mine = useMemo(() => appointments.filter((a) => a.customerId === user.id), [appointments, user.id]);

  const upcoming = mine.filter((a) => ['Pending', 'Confirmed', 'In Progress'].includes(a.status))
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const favTreatment = useMemo(() => {
    const counts = {};
    mine.forEach((a) => { counts[a.serviceName] = (counts[a.serviceName] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }, [mine]);

  const totalSpent = mine.filter((a) => a.status === 'Completed').reduce((s, a) => s + a.price, 0);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Hi {user.name.split(' ')[0]}, welcome back</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">Here's what's on your calendar and in your salon history.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Upcoming visits" value={upcoming.length} />
        <StatCard label="Favorite treatment" value={favTreatment} />
        <StatCard label="Lifetime spend" value={`$${totalSpent.toFixed(2)}`} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold m-0">Upcoming appointments</h3>
          <Link to="/app/book" className="btn btn-outline btn-small">Book another</Link>
        </div>
        {upcoming.length === 0 ? <EmptyState title="No upcoming appointments" description="Book a service to see it appear here." /> : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upcoming.map((a) => (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-amber-500">
                <div className="flex justify-between items-center"><strong>{a.serviceName}</strong> <StatusBadge status={a.status} /></div>
                <p className="text-gray-500 text-xs mt-1 mb-1">with {a.barberName}</p>
                <span className="font-mono text-xs">{a.date} · {a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <h3 className="text-base font-semibold px-5 pt-4 m-0">History</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2.5 font-bold">Date</th>
              <th className="text-left px-4 py-2.5 font-bold">Item</th>
              <th className="text-left px-4 py-2.5 font-bold">Type</th>
              <th className="text-right px-4 py-2.5 font-bold">Amount</th>
              <th className="text-right px-4 py-2.5 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-2.5 border-b border-gray-200 font-mono">{a.date}</td>
                <td className="px-4 py-2.5 border-b border-gray-200">{a.serviceName}</td>
                <td className="px-4 py-2.5 border-b border-gray-200">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Service</span>
                </td>
                <td className="px-4 py-2.5 border-b border-gray-200 text-right font-mono">${a.price.toFixed(2)}</td>
                <td className="px-4 py-2.5 border-b border-gray-200 text-right"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
            {mine.length === 0 && (
              <tr><td colSpan={5}><EmptyState title="No history yet" /></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
