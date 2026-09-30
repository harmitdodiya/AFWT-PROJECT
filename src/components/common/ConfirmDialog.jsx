import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', onConfirm, onClose, danger }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
      </DialogActions>
    </Dialog>
  );
}
