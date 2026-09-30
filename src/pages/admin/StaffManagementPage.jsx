import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { fetchStaff, saveStaff, deleteStaff } from '../../store/slices/staffSlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

const SKILLS = ['Haircut', 'Beard Styling', 'Hair Coloring', 'Facial'];

export default function StaffManagementPage() {
  const dispatch = useDispatch();
  const { items: staff, status } = useSelector((s) => s.staff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  useEffect(() => { dispatch(fetchStaff()); }, [dispatch]);

  const openCreate = () => { setEditing(null); reset({ name: '', email: '', role: 'Barber', skills: [], commissionRate: 0.35, workHours: '' }); setDialogOpen(true); };
  const openEdit = (m) => { setEditing(m); reset(m); setDialogOpen(true); };

  const onSubmit = async (data) => {
    await dispatch(saveStaff({ ...editing, ...data, commissionRate: Number(data.commissionRate) }));
    dispatch(showSnackbar({ message: editing ? 'Staff member updated.' : 'Staff member added.' }));
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteStaff(toDelete.id));
    dispatch(showSnackbar({ message: 'Staff member removed.', severity: 'info' }));
    setToDelete(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Staff management</h2>
          <p className="text-sm text-gray-500 mt-1 mb-0">Add, edit, or remove barbers and front-desk staff.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add staff</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {status === 'succeeded' && staff.length === 0 ? <EmptyState title="No staff yet" /> : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2.5 font-bold">Name</th>
                <th className="text-left px-4 py-2.5 font-bold">Role</th>
                <th className="text-left px-4 py-2.5 font-bold">Skills</th>
                <th className="text-left px-4 py-2.5 font-bold">Work hours</th>
                <th className="text-right px-4 py-2.5 font-bold">Commission</th>
                <th className="text-right px-4 py-2.5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 border-b border-gray-200">{s.name}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">{s.role}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">{s.skills.join(', ')}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">{s.workHours}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right">{(s.commissionRate * 100).toFixed(0)}%</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right">
                    <button className="p-1.5 bg-transparent border-0 cursor-pointer text-gray-500 rounded-md hover:bg-gray-200" onClick={() => openEdit(s)}>✎</button>
                    <button className="p-1.5 bg-transparent border-0 cursor-pointer text-gray-500 rounded-md hover:bg-gray-200" onClick={() => setToDelete(s)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit staff member' : 'Add staff member'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Full name</label>
              <input {...register('name', { required: 'Name is required' })} className={`px-3 py-2.5 border rounded-lg text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
            </div>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Email</label>
              <input {...register('email', { required: 'Email is required' })} className={`px-3 py-2.5 border rounded-lg text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
            </div>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Role</label>
              <Controller name="role" control={control} defaultValue="Barber" render={({ field }) => (
                <select {...field} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm">
                  <option value="Barber">Barber / Stylist</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              )} />
            </div>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Skills</label>
              <Controller name="skills" control={control} defaultValue={[]} render={({ field }) => (
                <select multiple {...field} onChange={(e) => field.onChange(Array.from(e.target.selectedOptions, (o) => o.value))} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm">
                  {SKILLS.map((sk) => <option key={sk} value={sk}>{sk}</option>)}
                </select>
              )} />
            </div>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Work hours</label>
              <input placeholder="e.g. Mon-Fri, 09:00-17:00" {...register('workHours')} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Commission rate (0 to 1)</label>
              <input type="number" step="0.05" min="0" max="1" {...register('commissionRate')} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <button type="button" className="btn btn-outline" onClick={() => setDialogOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Save changes' : 'Add staff'}</button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={Boolean(toDelete)} title="Remove staff member?" description={toDelete ? `${toDelete.name} will no longer be assignable.` : ''} confirmLabel="Remove" danger onConfirm={handleDelete} onClose={() => setToDelete(null)} />
    </div>
  );
}
