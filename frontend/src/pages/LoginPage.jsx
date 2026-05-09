import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { customerLogin } from '../redux/slices/authSlice';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginLoading, role } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/customer';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'customer' ? from : '/vendor/dashboard');
    }
  }, [isAuthenticated, navigate, from, role]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(customerLogin(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const fillDemo = () => {
    setFormData({ email: 'customer@demo.com', password: 'Customer@123' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <span className="text-xl font-bold text-gray-800">ServiceBook</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-500 mt-2">Login to book your favorite services</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Demo Credentials Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-blue-700 text-sm font-medium text-center">
              🎉 Demo Account Available
            </p>
            <p className="text-blue-600 text-xs text-center mt-1">
              Email: customer@demo.com | Password: Customer@123
            </p>
            <button
              onClick={fillDemo}
              className="w-full mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-100 py-1.5 rounded-lg transition-colors"
            >
              Fill Demo Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-11"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-11 pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loginLoading ? (
                <>
                  <div className="w-5 h-5 loading-spinner" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <User size={18} />
                  <span>Login as Customer</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-red-600 font-semibold hover:text-red-700">Sign Up</Link>
            </p>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Are you a vendor?{' '}
                <Link to="/vendor/login" className="text-red-600 font-semibold hover:text-red-700">
                  Vendor Login →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;