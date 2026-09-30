import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../../store/slices/appointmentsSlice';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function CustomerLookupPage() {
  const dispatch = useDispatch();
  const { items: appointments } = useSelector((s) => s.appointments);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => { dispatch(fetchAppointments()); }, [dispatch]);

  const customers = useMemo(() => {
    const map = new Map();
    appointments.forEach((a) => {
      if (!map.has(a.customerId)) map.set(a.customerId, { id: a.customerId, name: a.customerName, visitCount: 0, totalSpend: 0 });
      const entry = map.get(a.customerId);
      entry.visitCount += 1;
      if (a.status === 'Completed') entry.totalSpend += a.price;
    });
    return Array.from(map.values());
  }, [appointments]);

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const selected = customers.find((c) => c.id === selectedId);
  const selectedHistory = appointments
    .filter((a) => a.customerId === selectedId)
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Customer lookup</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">Search and verify customer profiles before checking them in.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          {filtered.length === 0 ? <EmptyState title="No customers found" /> : (
            <div className="max-h-[400px] overflow-y-auto">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className={`px-4 py-3 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${selectedId === c.id ? 'bg-amber-50 border-l-2 border-l-amber-500' : ''}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-semibold text-sm">{c.name[0]}</div>
                    <div>
                      <div className="font-bold text-sm">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.visitCount} visit{c.visitCount === 1 ? '' : 's'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 min-h-[300px]">
          {!selected ? <EmptyState title="Select a customer" description="Choose a name on the left to view their profile." /> : (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-800 text-white flex items-center justify-center font-semibold text-lg">{selected.name[0]}</div>
                <div>
                  <h3 className="text-lg font-semibold m-0 mb-1">{selected.name}</h3>
                  <div className="text-gray-500 text-xs">{selected.visitCount} total visits · ${selected.totalSpend.toFixed(2)} lifetime spend</div>
                </div>
              </div>
              <h4 className="text-sm font-bold mb-3 mt-0">Appointment history</h4>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left px-4 py-2.5 font-bold">Service</th>
                    <th className="text-left px-4 py-2.5 font-bold">Stylist</th>
                    <th className="text-left px-4 py-2.5 font-bold">Date</th>
                    <th className="text-left px-4 py-2.5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedHistory.map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-2.5 border-b border-gray-200">{a.serviceName}</td>
                      <td className="px-4 py-2.5 border-b border-gray-200">{a.barberName}</td>
                      <td className="px-4 py-2.5 border-b border-gray-200 font-mono">{a.date}</td>
                      <td className="px-4 py-2.5 border-b border-gray-200"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
