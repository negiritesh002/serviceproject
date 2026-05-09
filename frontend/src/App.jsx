import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VendorLoginPage from './pages/VendorLoginPage';
import VendorSignupPage from './pages/VendorSignupPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ServicesPage from './pages/customer/ServicesPage';
import ServiceDetail from './pages/customer/ServiceDetail';
import BookingPage from './pages/customer/BookingPage';
import BookingHistoryPage from './pages/customer/BookingHistoryPage';
import BookingDetailPage from './pages/customer/BookingDetailPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorBookingsPage from './pages/vendor/VendorBookingsPage';
import VendorProfilePage from './pages/vendor/VendorProfilePage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

// Redux
import { loadUser } from './redux/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isLoading, token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/vendor/login" element={<VendorLoginPage />} />
            <Route path="/vendor/signup" element={<VendorSignupPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetail />} />

            {/* Customer Protected Routes */}
            <Route path="/customer" element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/customer/book/:serviceId" element={
              <ProtectedRoute role="customer">
                <BookingPage />
              </ProtectedRoute>
            } />
            <Route path="/customer/bookings" element={
              <ProtectedRoute role="customer">
                <BookingHistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/customer/bookings/:id" element={
              <ProtectedRoute role="customer">
                <BookingDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/customer/profile" element={
              <ProtectedRoute role="customer">
                <CustomerProfilePage />
              </ProtectedRoute>
            } />

            {/* Vendor Protected Routes */}
            <Route path="/vendor/dashboard" element={
              <ProtectedRoute role="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vendor/bookings" element={
              <ProtectedRoute role="vendor">
                <VendorBookingsPage />
              </ProtectedRoute>
            } />
            <Route path="/vendor/profile" element={
              <ProtectedRoute role="vendor">
                <VendorProfilePage />
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' }
          }
        }}
      />
    </Router>
  );
}

export default App;
