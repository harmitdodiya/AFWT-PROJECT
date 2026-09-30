import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { fetchServices, saveService, deleteService } from '../../store/slices/servicesSlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

const CATEGORIES = ['Haircut', 'Beard Styling', 'Hair Coloring', 'Facial'];

export default function ServicePricingPage() {
  const dispatch = useDispatch();
  const { items: services, status } = useSelector((s) => s.services);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  useEffect(() => { dispatch(fetchServices()); }, [dispatch]);

  const openCreate = () => { setEditing(null); reset({ name: '', category: 'Haircut', price: 20, duration: 30 }); setDialogOpen(true); };
  const openEdit = (s) => { setEditing(s); reset(s); setDialogOpen(true); };

  const onSubmit = async (data) => {
    await dispatch(saveService({ ...editing, ...data, price: Number(data.price), duration: Number(data.duration) }));
    dispatch(showSnackbar({ message: editing ? 'Service updated.' : 'Service added.' }));
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteService(toDelete.id));
    dispatch(showSnackbar({ message: 'Service removed.', severity: 'info' }));
    setToDelete(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Service pricing</h2>
          <p className="text-sm text-gray-500 mt-1 mb-0">Manage the treatment catalog customers browse and book from.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add service</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {status === 'succeeded' && services.length === 0 ? <EmptyState title="No services yet" /> : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2.5 font-bold">Name</th>
                <th className="text-left px-4 py-2.5 font-bold">Category</th>
                <th className="text-right px-4 py-2.5 font-bold">Duration</th>
                <th className="text-right px-4 py-2.5 font-bold">Price</th>
                <th className="text-right px-4 py-2.5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 border-b border-gray-200">{s.name}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">{s.category}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right font-mono">{s.duration} min</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right font-mono">${s.price.toFixed(2)}</td>
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
        <DialogTitle>{editing ? 'Edit service' : 'Add service'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Service name</label>
              <input {...register('name', { required: 'Name is required' })} className={`px-3 py-2.5 border rounded-lg text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
            </div>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Category</label>
              <Controller name="category" control={control} defaultValue="Haircut" render={({ field }) => (
                <select {...field} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
              )} />
            </div>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Duration (minutes)</label>
              <input type="number" {...register('duration', { required: true, min: 5 })} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3.5">
              <label className="text-xs font-semibold text-gray-500">Price (USD)</label>
              <input type="number" step="0.5" {...register('price', { required: true, min: 0 })} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <button type="button" className="btn btn-outline" onClick={() => setDialogOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Save changes' : 'Add service'}</button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={Boolean(toDelete)} title="Remove this service?" description={toDelete ? `${toDelete.name} will no longer be bookable.` : ''} confirmLabel="Remove" danger onConfirm={handleDelete} onClose={() => setToDelete(null)} />
    </div>
  );
}
