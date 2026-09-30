import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser, clearAuthError } from '../../store/slices/authSlice';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate('/app/dashboard', { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h3 style={{ fontFamily: "var(--serif)", margin: '0 0 4px' }}>Create your account</h3>
      <p className="text-muted text-small" style={{ marginBottom: 16 }}>
        Book appointments and shop retail products in a few clicks.
      </p>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 12 }}>
          {error}
          <button type="button" className="btn-icon" style={{ float: 'right' }} onClick={() => dispatch(clearAuthError())}>✕</button>
        </div>
      )}

      <div className="field">
        <label>Full name</label>
        <input {...register('name', { required: 'Name is required' })} className={errors.name ? 'error' : ''} />
        {errors.name && <span className="error-msg">{errors.name.message}</span>}
      </div>

      <div className="field">
        <label>Email</label>
        <input type="email" {...register('email', { required: 'Email is required' })} className={errors.email ? 'error' : ''} />
        {errors.email && <span className="error-msg">{errors.email.message}</span>}
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} className={errors.password ? 'error' : ''} />
        {errors.password && <span className="error-msg">{errors.password.message}</span>}
      </div>

      <div className="field">
        <label>Confirm password</label>
        <input type="password" {...register('confirmPassword', { required: 'Please confirm your password', validate: (v) => v === password || 'Passwords do not match' })} className={errors.confirmPassword ? 'error' : ''} />
        {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 14 }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-small">
        Already have an account? <Link to="/login" className="link">Sign in</Link>
      </p>
    </form>
  );
}
