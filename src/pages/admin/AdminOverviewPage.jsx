import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import { fetchStaff } from '../../store/slices/staffSlice';
import { fetchServices } from '../../store/slices/servicesSlice';
import { fetchAppointments } from '../../store/slices/appointmentsSlice';

const LINKS = [
  { label: 'Staff management', to: '/admin/staff' },
  { label: 'Service pricing', to: '/admin/services' },
  { label: 'Inventory', to: '/admin/inventory' },
];

export default function AdminOverviewPage() {
  const dispatch = useDispatch();
  const { items: staff } = useSelector((s) => s.staff);
  const { items: services } = useSelector((s) => s.services);
  const { items: appointments } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchServices());
    dispatch(fetchAppointments());
  }, [dispatch]);

  const active = appointments.filter((a) => !['Completed', 'Cancelled'].includes(a.status)).length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Business overview</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">A snapshot of Vance &amp; Co. across staff, services, and bookings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Active staff" value={staff.length} />
        <StatCard label="Services offered" value={services.length} />
        <StatCard label="Open appointments" value={active} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block px-5 py-3.5 border-b border-gray-200 last:border-b-0 no-underline text-gray-800 hover:bg-gray-50 transition-colors"
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
