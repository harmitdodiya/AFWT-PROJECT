import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, blockSlot, unblockSlot } from '../../store/slices/staffSlice';
import { showSnackbar } from '../../store/slices/uiSlice';

const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const t = 9 * 60 + i * 30;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
});

function nextNDays(n) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
  return days;
}
const toISO = (d) => d.toISOString().slice(0, 10);

export default function AvailabilityPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: staff } = useSelector((s) => s.staff);
  const me = staff.find((s) => s.id === user.id);
  const [date, setDate] = useState(toISO(new Date()));
  const days = nextNDays(14);

  useEffect(() => { dispatch(fetchStaff()); }, [dispatch]);

  const toggleSlot = (time) => {
    const label = `${date} ${time}`;
    if (me?.blockedSlots.includes(label)) {
      dispatch(unblockSlot({ staffId: user.id, slotLabel: label }));
      dispatch(showSnackbar({ message: `${time} on ${date} reopened.` }));
    } else {
      dispatch(blockSlot({ staffId: user.id, slotLabel: label }));
      dispatch(showSnackbar({ message: `${time} on ${date} blocked off.`, severity: 'info' }));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Availability</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">Block off time slots you're not taking appointments — customers won't see them when booking.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-bold mb-2 mt-0">Select a day</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => {
            const iso = toISO(d);
            return <button key={iso} className={`chip ${date === iso ? 'active' : ''}`} onClick={() => setDate(iso)}>{d.toLocaleDateString(undefined, { weekday: 'short' })} {d.getDate()}</button>;
          })}
        </div>
        <hr className="border-t border-gray-200 my-4" />
        <p className="text-xs font-bold mb-2 mt-0">Tap a slot to block or reopen it</p>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((time) => {
            const blocked = me?.blockedSlots.includes(`${date} ${time}`);
            return <button key={time} className={`chip ${blocked ? 'danger' : 'success'}`} onClick={() => toggleSlot(time)}>{time}</button>;
          })}
        </div>
      </div>
    </div>
  );
}
