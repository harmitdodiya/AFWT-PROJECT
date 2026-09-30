import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, updateAppointment } from '../../store/slices/appointmentsSlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function MyAppointmentsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: appointments, status } = useSelector((s) => s.appointments);
  const [toCancel, setToCancel] = useState(null);

  useEffect(() => { dispatch(fetchAppointments()); }, [dispatch]);

  const mine = appointments.filter((a) => a.customerId === user.id)
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  const handleCancel = async () => {
    await dispatch(updateAppointment({ id: toCancel.id, changes: { status: 'Cancelled' } }));
    dispatch(showSnackbar({ message: 'Appointment cancelled.', severity: 'info' }));
    setToCancel(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>My appointments</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {status === 'succeeded' && mine.length === 0 ? (
          <EmptyState title="No appointments yet" description="Book your first visit from the service catalog." />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2.5 font-bold">Service</th>
                <th className="text-left px-4 py-2.5 font-bold">Stylist</th>
                <th className="text-left px-4 py-2.5 font-bold">Date</th>
                <th className="text-left px-4 py-2.5 font-bold">Time</th>
                <th className="text-right px-4 py-2.5 font-bold">Price</th>
                <th className="text-left px-4 py-2.5 font-bold">Status</th>
                <th className="text-right px-4 py-2.5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 border-b border-gray-200">{a.serviceName}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">{a.barberName}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 font-mono">{a.date}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 font-mono">{a.time}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right font-mono">${a.price.toFixed(2)}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right">
                    <button
                      className="text-red-600 bg-transparent border-0 text-sm cursor-pointer hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={['Cancelled', 'Completed'].includes(a.status)}
                      onClick={() => setToCancel(a)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog open={Boolean(toCancel)} title="Cancel this appointment?" description={toCancel ? `${toCancel.serviceName} on ${toCancel.date} at ${toCancel.time} will be cancelled.` : ''} confirmLabel="Cancel appointment" danger onConfirm={handleCancel} onClose={() => setToCancel(null)} />
    </div>
  );
}
