import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { fetchAppointments, updateAppointment } from '../../store/slices/appointmentsSlice';
import { showSnackbar } from '../../store/slices/uiSlice';

const TRANSITIONS = {
  Pending: { label: 'Confirm', next: 'Confirmed' },
  Confirmed: { label: 'Start', next: 'In Progress' },
  'In Progress': { label: 'Complete', next: 'Completed' },
};

export default function BarberDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: appointments } = useSelector((s) => s.appointments);

  useEffect(() => { dispatch(fetchAppointments()); }, [dispatch]);

  const mine = useMemo(
    () => appointments.filter((a) => a.barberId === user.id).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)),
    [appointments, user.id]
  );

  const today = new Date().toISOString().slice(0, 10);
  const todays = mine.filter((a) => a.date === today && a.status !== 'Cancelled');
  const completed = mine.filter((a) => a.status === 'Completed').length;
  const estEarnings = mine.filter((a) => a.status === 'Completed').reduce((sum, a) => sum + a.price, 0) * 0.4;

  const advance = async (a) => {
    const t = TRANSITIONS[a.status];
    if (!t) return;
    await dispatch(updateAppointment({ id: a.id, changes: { status: t.next } }));
    dispatch(showSnackbar({ message: `Marked as ${t.next}.` }));
  };

  const cancel = async (a) => {
    await dispatch(updateAppointment({ id: a.id, changes: { status: 'Cancelled' } }));
    dispatch(showSnackbar({ message: 'Appointment cancelled.', severity: 'info' }));
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Good to see you, {user.name.split(' ')[0]}</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">Your assignment sheet for today and beyond.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Today's appointments" value={todays.length} />
        <StatCard label="Completed (all-time)" value={completed} />
        <StatCard label="Est. commission earned" value={`$${estEarnings.toFixed(2)}`} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <h3 className="text-base font-semibold px-5 pt-4 m-0">Assignment sheet</h3>
        {mine.length === 0 ? <EmptyState title="No assignments yet" /> : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2.5 font-bold">Customer</th>
                <th className="text-left px-4 py-2.5 font-bold">Service</th>
                <th className="text-left px-4 py-2.5 font-bold">Date</th>
                <th className="text-left px-4 py-2.5 font-bold">Time</th>
                <th className="text-left px-4 py-2.5 font-bold">Status</th>
                <th className="text-right px-4 py-2.5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 border-b border-gray-200">{a.customerName}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">{a.serviceName}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 font-mono">{a.date}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 font-mono">{a.time}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {TRANSITIONS[a.status] && <button className="btn btn-outline btn-small" onClick={() => advance(a)}>{TRANSITIONS[a.status].label}</button>}
                      {!['Completed', 'Cancelled'].includes(a.status) && (
                        <button
                          className="text-red-600 bg-transparent border-0 text-sm cursor-pointer hover:underline"
                          onClick={() => cancel(a)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
