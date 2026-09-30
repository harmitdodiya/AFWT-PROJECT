import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="barber-stripe" />
      <div className="auth-center">
        <div className="auth-box">
          <div className="auth-brand">
            <h2>Vance &amp; Co.</h2>
          </div>
          <div className="auth-card">
            <Outlet />
          </div>
          <p className="auth-footer">
            Salon Management Portal — frontend demo (mock data, no live backend)
          </p>
        </div>
      </div>
    </div>
  );
}
