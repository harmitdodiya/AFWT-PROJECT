import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage';
import ServiceCatalogPage from '../pages/customer/ServiceCatalogPage';
import BookingWizardPage from '../pages/customer/BookingWizardPage';
import MyAppointmentsPage from '../pages/customer/MyAppointmentsPage';

import BarberDashboardPage from '../pages/barber/BarberDashboardPage';
import AvailabilityPage from '../pages/barber/AvailabilityPage';

import MasterSchedulePage from '../pages/receptionist/MasterSchedulePage';
import CustomerLookupPage from '../pages/receptionist/CustomerLookupPage';

import AdminOverviewPage from '../pages/admin/AdminOverviewPage';
import StaffManagementPage from '../pages/admin/StaffManagementPage';
import ServicePricingPage from '../pages/admin/ServicePricingPage';
import InventoryManagementPage from '../pages/admin/InventoryManagementPage';

const ROLE_HOME = {
  Customer: '/app/dashboard',
  Barber: '/barber/dashboard',
  Receptionist: '/reception/schedule',
  Administrator: '/admin',
};

function RoleHomeRedirect() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleHomeRedirect />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Customer workflows */}
      <Route
        path="/app"
        element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboardPage />} />
        <Route path="services" element={<ServiceCatalogPage />} />
        <Route path="book" element={<BookingWizardPage />} />
        <Route path="appointments" element={<MyAppointmentsPage />} />
      </Route>

      {/* Barber / stylist workflows */}
      <Route
        path="/barber"
        element={
          <ProtectedRoute allowedRoles={['Barber']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<BarberDashboardPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
      </Route>

      {/* Receptionist workflows */}
      <Route
        path="/reception"
        element={
          <ProtectedRoute allowedRoles={['Receptionist']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="schedule" replace />} />
        <Route path="schedule" element={<MasterSchedulePage />} />
        <Route path="customers" element={<CustomerLookupPage />} />
      </Route>

      {/* Administrator workflows */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="services" element={<ServicePricingPage />} />
        <Route path="inventory" element={<InventoryManagementPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
