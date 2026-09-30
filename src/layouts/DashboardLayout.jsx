import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import DashIcon from '@mui/icons-material/DashboardOutlined';
import CutIcon from '@mui/icons-material/ContentCutOutlined';
import BookIcon from '@mui/icons-material/EventAvailableOutlined';
import ApptIcon from '@mui/icons-material/EventNoteOutlined';
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import InvIcon from '@mui/icons-material/Inventory2Outlined';
import PriceIcon from '@mui/icons-material/PriceChangeOutlined';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import { logout } from '../store/slices/authSlice';

const W = 250;

const NAV = {
  Customer: [
    { label: 'Dashboard', to: '/app/dashboard', icon: <DashIcon /> },
    { label: 'Services', to: '/app/services', icon: <CutIcon /> },
    { label: 'Book Appointment', to: '/app/book', icon: <BookIcon /> },
    { label: 'My Appointments', to: '/app/appointments', icon: <ApptIcon /> },
  ],
  Barber: [
    { label: 'Dashboard', to: '/barber/dashboard', icon: <DashIcon /> },
    { label: 'Availability', to: '/barber/availability', icon: <CalendarIcon /> },
  ],
  Receptionist: [
    { label: 'Master Schedule', to: '/reception/schedule', icon: <CalendarIcon /> },
    { label: 'Customer Lookup', to: '/reception/customers', icon: <PeopleIcon /> },
  ],
  Administrator: [
    { label: 'Overview', to: '/admin', icon: <DashIcon /> },
    { label: 'Staff Management', to: '/admin/staff', icon: <GroupIcon /> },
    { label: 'Service Pricing', to: '/admin/services', icon: <PriceIcon /> },
    { label: 'Inventory', to: '/admin/inventory', icon: <InvIcon /> },
  ],
};

export default function DashboardLayout() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mobile = useMediaQuery('(max-width:900px)');
  const [open, setOpen] = useState(false);

  const links = NAV[user?.role] || [];
  const pageTitle = links.find((n) => location.pathname.startsWith(n.to))?.label || 'Welcome';

  const doLogout = () => { dispatch(logout()); navigate('/login'); };

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 24px' }}>
        <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--serif)' }}>Vance &amp; Co.</h3>
        <p className="text-small text-muted" style={{ margin: 0 }}>Salon Management Portal</p>
      </div>

      <hr className="divider" style={{ margin: '0 0 16px' }} />

      <div style={{ flexGrow: 1, padding: '0 12px' }}>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={() => setOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 8,
              textDecoration: 'none', color: isActive ? 'var(--ivory)' : 'var(--ink)',
              background: isActive ? 'var(--pine)' : 'transparent', marginBottom: 4, fontWeight: 500, fontSize: '0.875rem'
            })}
          >
            <div style={{ display: 'flex', opacity: 0.8 }}>{item.icon}</div>
            {item.label}
          </NavLink>
        ))}
      </div>

      <hr className="divider" style={{ margin: '16px 0 0' }} />

      <div style={{ padding: 16 }}>
        <p className="text-small text-muted" style={{ margin: '0 0 4px' }}>Signed in as</p>
        <div className="bold text-small">{user?.name} · {user?.role}</div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={doLogout}>
          <LogoutIcon style={{ fontSize: 20 }} /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ width: { md: `calc(100% - ${W}px)` }, ml: { md: `${W}px` }, bgcolor: 'var(--paper)', color: 'var(--ink)', borderBottom: '1px solid var(--line)' }}>
        <div className="barber-stripe" style={{ position: 'absolute', top: 0, left: 0 }} />
        <Toolbar sx={{ mt: '4px' }}>
          {mobile && <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 1 }}><MenuIcon /></IconButton>}
          <div style={{ flexGrow: 1, fontFamily: "var(--serif)", fontSize: '1.1rem', fontWeight: 600 }}>{pageTitle}</div>
        </Toolbar>
      </AppBar>

      <div style={{ width: mobile ? 0 : W, flexShrink: 0 }}>
        <Drawer
          variant={mobile ? 'temporary' : 'permanent'}
          open={mobile ? open : true}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: W, border: 'none', borderRight: '1px solid var(--line)', bgcolor: 'var(--paper)' } }}
        >
          {sidebar}
        </Drawer>
      </div>

      <main style={{ flexGrow: 1, padding: mobile ? 16 : 32, marginTop: 68, width: mobile ? '100%' : `calc(100% - ${W}px)` }}>
        <Outlet />
      </main>
    </div>
  );
}
