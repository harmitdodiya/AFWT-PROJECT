import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function UnauthorizedPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedIn = useSelector((s) => s.auth.isAuthenticated);

  const doLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div className="auth-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="card text-center" style={{ width: '100%', maxWidth: 400 }}>
        <h2 style={{ fontSize: '3rem', margin: '0 0 10px', fontFamily: 'var(--serif)' }}>403</h2>
        <p className="text-muted" style={{ margin: '0 0 20px' }}>Your role doesn't have access to that area.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to="/" className="btn btn-primary" style={{ justifyContent: 'center' }}>Back to my dashboard</Link>
          {loggedIn && (
            <button className="btn btn-danger-outline" style={{ justifyContent: 'center' }} onClick={doLogout}>
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
