import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { clearSnackbar } from '../../store/slices/uiSlice';

export default function Notifier() {
  const snackbar = useSelector((state) => state.ui.snackbar);
  const dispatch = useDispatch();

  return (
    <Snackbar
      key={snackbar?.key}
      open={Boolean(snackbar)}
      autoHideDuration={3500}
      onClose={() => dispatch(clearSnackbar())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      {snackbar ? (
        <Alert onClose={() => dispatch(clearSnackbar())} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
