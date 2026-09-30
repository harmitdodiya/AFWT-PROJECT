import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, updateAppointment } from '../../store/slices/appointmentsSlice';
import { fetchStaff } from '../../store/slices/staffSlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function MasterSchedulePage() {
  const dispatch = useDispatch();
  const { items: appointments } = useSelector((s) => s.appointments);
  const { items: staff } = useSelector((s) => s.staff);
  const barbers = staff.filter((s) => s.role === 'Barber');

  const [dateFilter, setDateFilter] = useState('');
  const [barberFilter, setBarberFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => { dispatch(fetchAppointments()); dispatch(fetchStaff()); }, [dispatch]);

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => !dateFilter || a.date === dateFilter)
      .filter((a) => barberFilter === 'All' || a.barberId === barberFilter)
      .filter((a) => statusFilter === 'All' || a.status === statusFilter)
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  }, [appointments, dateFilter, barberFilter, statusFilter]);

  const handleStatus = async (a, status) => {
    await dispatch(updateAppointment({ id: a.id, changes: { status } }));
    dispatch(showSnackbar({ message: `${a.customerName}'s appointment marked ${status}.` }));
  };

  const handleReassign = async (a, barberId) => {
    const b = barbers.find((b) => b.id === barberId);
    await dispatch(updateAppointment({ id: a.id, changes: { barberId: b.id, barberName: b.name } }));
    dispatch(showSnackbar({ message: `Reassigned to ${b.name}.` }));
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Master schedule</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">Every reservation across every stylist — filter, track, and update in one grid.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Date</label>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Stylist</label>
            <select value={barberFilter} onChange={(e) => setBarberFilter(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm">
              <option value="All">All stylists</option>
              {barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm">
              <option value="All">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? <EmptyState title="No appointments match these filters" /> : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2.5 font-bold">Customer</th>
                <th className="text-left px-4 py-2.5 font-bold">Service</th>
                <th className="text-left px-4 py-2.5 font-bold">Stylist</th>
                <th className="text-left px-4 py-2.5 font-bold">Date</th>
                <th className="text-left px-4 py-2.5 font-bold">Time</th>
                <th className="text-left px-4 py-2.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 border-b border-gray-200">{a.customerName}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">{a.serviceName}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">
                    <select
                      value={a.barberId}
                      onChange={(e) => handleReassign(a, e.target.value)}
                      disabled={['Completed', 'Cancelled'].includes(a.status)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2.5 border-b border-gray-200 font-mono">{a.date}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 font-mono">{a.time}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">
                    <div className="flex flex-col gap-1.5 items-start">
                      <StatusBadge status={a.status} />
                      <select
                        value={a.status}
                        onChange={(e) => handleStatus(a, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
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
