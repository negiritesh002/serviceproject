import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOTP, customerSignup, resetOTPState } from '../redux/slices/authSlice';
import {
  Phone, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, CheckCircle, Shield, RefreshCw
} from 'lucide-react';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, otpSent, otpLoading, signupLoading, role } = useSelector(state => state.auth);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isAuthenticated && role === 'customer') {
      navigate('/customer');
    }
    return () => dispatch(resetOTPState());
  }, [isAuthenticated, navigate, dispatch, role]);

  useEffect(() => {
    if (otpSent && step === 1) setStep(2);
  }, [otpSent]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Valid 10-digit Indian phone number required';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Must include uppercase, lowercase & number';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(sendOTP({ phone: formData.phone, email: formData.email }));
    setCountdown(30);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter 6-digit OTP' });
      return;
    }

    dispatch(customerSignup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      otp: formData.otp
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    dispatch(sendOTP({ phone: formData.phone, email: formData.email }));
    setCountdown(30);
    setFormData(prev => ({ ...prev, otp: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <span className="text-xl font-bold text-gray-800">ServiceBook</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join millions of happy customers</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${step >= 1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {step > 1 ? <CheckCircle size={18} /> : '1'}
            </div>
            <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-red-500' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${step >= 2 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              2
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {step === 1 ? (
            /* Step 1: User Info */
            <form onSubmit={handleSendOTP} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Details</h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-11"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-11"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <Phone size={18} className="text-gray-400" />
                    <span className="text-gray-400 text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    className="input-field pl-20"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-11 pr-11"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-11"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="btn-primary w-full mt-6 flex items-center justify-center space-x-2"
              >
                {otpLoading ? (
                  <>
                    <div className="w-5 h-5 loading-spinner" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone size={28} className="text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Verify Your Phone</h2>
                <p className="text-gray-500 text-sm mt-1">
                  We've sent a 6-digit OTP to <span className="font-semibold text-gray-800">+91 {formData.phone}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  className="input-field text-center text-3xl font-bold tracking-widest py-4"
                />
                {errors.otp && <p className="text-red-500 text-xs mt-1 text-center">{errors.otp}</p>}
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in <span className="text-red-600 font-semibold">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 mx-auto"
                  >
                    <RefreshCw size={14} />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {signupLoading ? (
                  <>
                    <div className="w-5 h-5 loading-spinner" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Verify & Create Account</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); dispatch(resetOTPState()); }}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
              >
                ← Change details
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Shield size={12} className="text-green-500" />
              <span>Your data is secure and encrypted</span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 font-semibold hover:text-red-700">Login</Link>
            </p>
            <p className="text-sm text-gray-500 text-center">
              Are you a vendor?{' '}
              <Link to="/vendor/signup" className="text-red-600 font-semibold hover:text-red-700">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
