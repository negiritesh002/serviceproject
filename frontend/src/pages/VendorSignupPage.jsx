import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { vendorSignup } from '../redux/slices/authSlice';
import { Mail, Lock, User, Phone, MapPin, Briefcase, Eye, EyeOff, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  'Plumbing', 'Electrical', 'Cleaning', 'Carpentry',
  'Painting', 'AC Repair', 'Appliance Repair', 'Pest Control',
  'Landscaping', 'Security', 'Moving', 'Photography', 'Other'
];

const STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana',
  'Gujarat', 'Rajasthan', 'West Bengal', 'Uttar Pradesh', 'Pune'
];

const VendorSignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, signupLoading, role } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    businessName: '', ownerName: '', email: '', phone: '',
    password: '', confirmPassword: '', category: '', city: '', state: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated && role === 'vendor') {
      navigate('/vendor/dashboard');
    }
  }, [isAuthenticated, navigate, role]);

  const validate = () => {
    const e = {};
    if (!formData.businessName.trim()) e.businessName = 'Business name required';
    if (!formData.ownerName.trim()) e.ownerName = 'Owner name required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required';
    if (!/^[6-9]\d{9}$/.test(formData.phone)) e.phone = 'Valid 10-digit phone required';
    if (formData.password.length < 6) e.password = 'Password min 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.category) e.category = 'Select a category';
    if (!formData.city.trim()) e.city = 'City is required';
    if (!formData.state) e.state = 'State is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(vendorSignup(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const inputClass = "w-full pl-11 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <span className="text-xl font-bold text-white">ServiceBook</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Register Your Business</h1>
          <p className="text-gray-400 mt-2">Join 50,000+ professionals on ServiceBook</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div>
                <label className={labelClass}>Business Name</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="businessName" placeholder="Your Business Name" value={formData.businessName} onChange={handleChange} className={inputClass} />
                </div>
                {errors.businessName && <p className="text-red-400 text-xs mt-1">{errors.businessName}</p>}
              </div>

              {/* Owner Name */}
              <div>
                <label className={labelClass}>Owner Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="ownerName" placeholder="Your Full Name" value={formData.ownerName} onChange={handleChange} className={inputClass} />
                </div>
                {errors.ownerName && <p className="text-red-400 text-xs mt-1">{errors.ownerName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="email" name="email" placeholder="business@email.com" value={formData.email} onChange={handleChange} className={inputClass} />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="tel" name="phone" placeholder="9876543210" maxLength={10} value={formData.phone} onChange={handleChange} className={inputClass} />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>Service Category</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select name="category" value={formData.category} onChange={handleChange} className={`${inputClass} appearance-none`}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* City */}
              <div>
                <label className={labelClass}>City</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="city" placeholder="Your City" value={formData.city} onChange={handleChange} className={inputClass} />
                </div>
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>

              {/* State */}
              <div>
                <label className={labelClass}>State</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select name="state" value={formData.state} onChange={handleChange} className={`${inputClass} appearance-none`}>
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Create password" value={formData.password} onChange={handleChange} className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button type="submit" disabled={signupLoading} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center space-x-2 shadow-lg mt-6">
              {signupLoading ? (
                <>
                  <div className="w-5 h-5 loading-spinner" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Register Business</span>
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have a vendor account?{' '}
            <Link to="/vendor/login" className="text-orange-400 font-semibold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorSignupPage;