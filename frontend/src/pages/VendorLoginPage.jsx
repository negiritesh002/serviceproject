import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { vendorLogin } from '../redux/slices/authSlice';
import { Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight } from 'lucide-react';

const VendorLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loginLoading, role } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && role === 'vendor') {
      navigate('/vendor/dashboard');
    }
  }, [isAuthenticated, navigate, role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(vendorLogin(formData));
  };

  const fillDemo = () => {
    setFormData({ email: 'vendor@demo.com', password: 'Vendor@123' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <span className="text-xl font-bold text-white">ServiceBook</span>
          </Link>
          <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase size={28} className="text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Vendor Portal</h1>
          <p className="text-gray-400 mt-2">Access your service dashboard</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-3xl p-8">
          {/* Demo Notice */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
            <p className="text-orange-400 text-sm font-medium text-center">
              🏪 Vendor Demo Account
            </p>
            <p className="text-orange-300 text-xs text-center mt-1">
              Email: vendor@demo.com | Password: Vendor@123
            </p>
            <button
              onClick={fillDemo}
              className="w-full mt-2 text-xs text-orange-400 hover:text-orange-300 font-semibold bg-orange-500/10 py-1.5 rounded-lg transition-colors"
            >
              Fill Demo Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="vendor@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="w-full pl-11 pr-11 py-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              {loginLoading ? (
                <>
                  <div className="w-5 h-5 loading-spinner" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <Briefcase size={18} />
                  <span>Access Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-500">
              New vendor?{' '}
              <Link to="/vendor/signup" className="text-orange-400 font-semibold hover:text-orange-300">
                Register your business
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Are you a customer?{' '}
              <Link to="/login" className="text-orange-400 font-semibold hover:text-orange-300">
                Customer Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLoginPage;