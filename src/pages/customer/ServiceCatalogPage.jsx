import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../../store/slices/servicesSlice';
import { setService } from '../../store/slices/bookingSlice';
import EmptyState from '../../components/common/EmptyState';

export default function ServiceCatalogPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: services, status } = useSelector((s) => s.services);
  const [priceCap, setPriceCap] = useState(80);
  const [maxDur, setMaxDur] = useState(0);

  useEffect(() => { dispatch(fetchServices()); }, [dispatch]);

  const filtered = useMemo(
    () => services.filter((s) => s.price <= priceCap && (maxDur === 0 || s.duration <= maxDur)),
    [services, priceCap, maxDur]
  );

  const grouped = useMemo(() => {
    return filtered.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});
  }, [filtered]);

  const handleBook = (service) => { dispatch(setService(service)); navigate('/app/book'); };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Service catalog</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">Browse treatments by category, then book directly into the wizard.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex gap-5 flex-wrap items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500">Price cap: <strong>${priceCap}</strong></label>
            <input type="range" min="15" max="80" step="5" value={priceCap} onChange={(e) => setPriceCap(+e.target.value)} className="w-full mt-1" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Duration</label>
              <select value={maxDur} onChange={(e) => setMaxDur(+e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm">
                <option value={0}>Any duration</option>
                <option value={30}>Up to 30 min</option>
                <option value={60}>Up to 60 min</option>
                <option value={90}>Up to 90 min</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {status === 'succeeded' && filtered.length === 0 && <EmptyState title="No treatments match your filters" />}

      {Object.entries(grouped).map(([category, list]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-2.5 mt-0">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((s) => (
              <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
                <strong>{s.name}</strong>
                <div className="text-xs text-gray-500 mt-1.5 mb-1.5">{s.duration} min</div>
                <div className="font-mono text-lg mb-2.5">${s.price.toFixed(2)}</div>
                <button className="btn btn-primary btn-small mt-auto" onClick={() => handleBook(s)}>Book now</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
