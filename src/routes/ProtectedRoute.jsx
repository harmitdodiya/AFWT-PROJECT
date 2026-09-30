import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

/**
 * Client-side routing guard. Blocks unauthenticated requests from mounting
 * protected view components, and restricts access further by role when
 * `allowedRoles` is provided (role-based UI access, per SRS section 4.1).
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (status === 'loading' && !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
