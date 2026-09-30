import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, clearAuthError } from '../../store/slices/authSlice';

const ROLE_HOME = {
  Customer: '/app/dashboard',
  Barber: '/barber/dashboard',
  Receptionist: '/reception/schedule',
  Administrator: '/admin',
};

const DEMOS = [
  { role: 'Customer', email: 'customer@salon.test' },
  { role: 'Barber', email: 'barber@salon.test' },
  { role: 'Receptionist', email: 'reception@salon.test' },
  { role: 'Administrator', email: 'admin@salon.test' },
];

export default function LoginPage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((s) => s.auth);

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      const dest = location.state?.from?.pathname || ROLE_HOME[result.payload.user.role] || '/';
      navigate(dest, { replace: true });
    }
  };

  const fillDemo = (email) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h3 style={{ fontFamily: "var(--serif)", margin: '0 0 4px' }}>Welcome back</h3>
      <p className="text-muted text-small" style={{ marginBottom: 16 }}>
        Sign in to manage your appointments, shifts, or the salon floor.
      </p>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 12 }}>
          {error}
          <button type="button" className="btn-icon" style={{ float: 'right' }} onClick={() => dispatch(clearAuthError())}>✕</button>
        </div>
      )}

      <div className="field">
        <label>Email</label>
        <input type="email" {...register('email', { required: 'Email is required' })} className={errors.email ? 'error' : ''} />
        {errors.email && <span className="error-msg">{errors.email.message}</span>}
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" {...register('password', { required: 'Password is required' })} className={errors.password ? 'error' : ''} />
        {errors.password && <span className="error-msg">{errors.password.message}</span>}
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 14 }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-small">
        New here? <Link to="/register" className="link">Create a customer account</Link>
      </p>

      <hr className="divider" />
      <p className="text-center text-muted text-small">Demo accounts</p>
      <div className="wrap" style={{ justifyContent: 'center', marginBottom: 8 }}>
        {DEMOS.map((acc) => (
          <button type="button" key={acc.email} className="chip" onClick={() => fillDemo(acc.email)}>
            {acc.role}
          </button>
        ))}
      </div>
      <p className="text-center text-muted text-small">Password for every demo account: password123</p>
    </form>
  );
}
