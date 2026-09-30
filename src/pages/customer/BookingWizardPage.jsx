import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Stepper, Step, StepLabel } from '@mui/material';
import { fetchServices } from '../../store/slices/servicesSlice';
import { fetchStaff } from '../../store/slices/staffSlice';
import { fetchAppointments, createAppointment } from '../../store/slices/appointmentsSlice';
import { setService, setBarber, setDateTime, nextStep, prevStep, resetBooking } from '../../store/slices/bookingSlice';
import { showSnackbar } from '../../store/slices/uiSlice';

const STEPS = ['Service', 'Stylist', 'Date & time', 'Confirm'];
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

export default function BookingWizardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: services } = useSelector((s) => s.services);
  const { items: staff } = useSelector((s) => s.staff);
  const { items: appointments } = useSelector((s) => s.appointments);
  const { user } = useSelector((s) => s.auth);
  const bk = useSelector((s) => s.bookingWizard);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchServices()); dispatch(fetchStaff()); dispatch(fetchAppointments()); }, [dispatch]);

  const barbers = useMemo(
    () => staff.filter((s) => s.role === 'Barber' && (!bk.selectedService || s.skills.includes(bk.selectedService.category))),
    [staff, bk.selectedService]
  );
  const days = useMemo(() => nextNDays(14), []);

  const isTaken = (bid, date, time) => appointments.some((a) => a.barberId === bid && a.date === date && a.time === time && a.status !== 'Cancelled');
  const isBlocked = (bid, date, time) => {
    const m = staff.find((s) => s.id === bid);
    return m?.timeOff.includes(date) || m?.blockedSlots.includes(`${date} ${time}`);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    const result = await dispatch(createAppointment({
      customerId: user.id, customerName: user.name,
      serviceId: bk.selectedService.id, serviceName: bk.selectedService.name,
      barberId: bk.selectedBarber.id, barberName: bk.selectedBarber.name,
      date: bk.selectedDate, time: bk.selectedTimeSlot, price: bk.selectedService.price,
    }));
    setSubmitting(false);
    if (createAppointment.fulfilled.match(result)) {
      dispatch(showSnackbar({ message: 'Appointment booked! We will see you soon.' }));
      dispatch(resetBooking());
      navigate('/app/appointments');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Book an appointment</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">A guided, step-by-step wizard — each step validates before you can continue.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <Stepper activeStep={bk.currentStep} alternativeLabel sx={{ mb: 3 }}>
          {STEPS.map((l) => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}
        </Stepper>

        {/* Step 0: Pick a service */}
        {bk.currentStep === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.id}
                className={`bg-white border rounded-xl p-5 cursor-pointer transition-all hover:border-amber-500 ${bk.selectedService?.id === s.id ? 'border-amber-500 border-2 shadow-sm' : 'border-gray-200'}`}
                onClick={() => dispatch(setService(s))}
              >
                <strong>{s.name}</strong>
                <div className="text-xs text-gray-500 mt-1">{s.category} · {s.duration} min</div>
                <div className="font-mono mt-1">${s.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Pick a stylist */}
        {bk.currentStep === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {barbers.length === 0 && <p className="text-gray-500">No stylists match that treatment — try another service.</p>}
            {barbers.map((b) => (
              <div
                key={b.id}
                className={`bg-white border rounded-xl p-5 cursor-pointer transition-all hover:border-amber-500 ${bk.selectedBarber?.id === b.id ? 'border-amber-500 border-2 shadow-sm' : 'border-gray-200'}`}
                onClick={() => dispatch(setBarber(b))}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-semibold text-sm">{b.name[0]}</div>
                  <div>
                    <strong>{b.name}</strong>
                    <div className="text-xs text-gray-500">{b.skills.join(', ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Pick date & time */}
        {bk.currentStep === 2 && (
          <div>
            <p className="text-xs font-bold mb-2">Choose a date</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const iso = toISO(d);
                return <button key={iso} className={`chip ${bk.selectedDate === iso ? 'active' : ''}`} onClick={() => dispatch(setDateTime({ date: iso, time: bk.selectedTimeSlot }))}>{d.toLocaleDateString(undefined, { weekday: 'short' })} {d.getDate()}</button>;
              })}
            </div>
            <hr className="border-t border-gray-200 my-4" />
            <p className="text-xs font-bold mb-2">Choose a time slot</p>
            {!bk.selectedDate && <p className="text-gray-500 text-xs">Pick a date to see availability.</p>}
            {bk.selectedDate && (
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((time) => {
                  const off = isTaken(bk.selectedBarber.id, bk.selectedDate, time) || isBlocked(bk.selectedBarber.id, bk.selectedDate, time);
                  return <button key={time} className={`chip ${bk.selectedTimeSlot === time ? 'active-brass' : ''}`} disabled={off} onClick={() => !off && dispatch(setDateTime({ date: bk.selectedDate, time }))}>{time}</button>;
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {bk.currentStep === 3 && (
          <div>
            <h3 className="text-base font-semibold mb-3 mt-0">Review your appointment</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Service</span><span>{bk.selectedService?.name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Stylist</span><span>{bk.selectedBarber?.name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-mono">{bk.selectedDate || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-mono">{bk.selectedTimeSlot || '—'}</span></div>
              <hr className="border-t border-gray-200 my-2" />
              <div className="flex justify-between"><strong>Total</strong><strong className="font-mono">${bk.selectedService?.price.toFixed(2)}</strong></div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button className="btn btn-outline" onClick={() => dispatch(prevStep())} disabled={bk.currentStep === 0}>Back</button>
          {bk.currentStep < 3 ? (
            <button className="btn btn-primary" onClick={() => dispatch(nextStep())} disabled={!bk.validationState.isCurrentStepValid}>Continue</button>
          ) : (
            <button className="btn btn-secondary" onClick={handleConfirm} disabled={submitting}>{submitting ? 'Booking…' : 'Confirm booking'}</button>
          )}
        </div>
      </div>
    </div>
  );
}
