import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  Menu, X, User, LogOut, ChevronDown,
  Briefcase, Home, Grid, Clock, Settings
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, role } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setUserMenuOpen(false);
  };

  const customerLinks = [
    { to: '/customer', label: 'Dashboard', icon: Home },
    { to: '/services', label: 'Services', icon: Grid },
    { to: '/customer/bookings', label: 'My Bookings', icon: Clock },
  ];

  const vendorLinks = [
    { to: '/vendor/dashboard', label: 'Dashboard', icon: Home },
    { to: '/vendor/bookings', label: 'Bookings', icon: Briefcase },
  ];

  const links = role === 'customer' ? customerLinks : vendorLinks;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                ServiceBook
              </span>
              <span className="text-[10px] text-gray-400 -mt-1 leading-none">On-Demand Services</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/services"
                  className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all"
                >
                  Services
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
                <Link
                  to="/vendor/login"
                  className="ml-2 px-4 py-2 border-2 border-red-500 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all"
                >
                  Vendor Login
                </Link>
              </>
            ) : (
              <>
                {links.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center space-x-1.5 px-3 py-2 text-gray-600 hover:text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}

                {/* User Menu */}
                <div className="relative ml-3">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {(user?.name || user?.businessName || user?.ownerName || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-gray-800 leading-none">
                        {user?.name || user?.businessName || user?.ownerName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{user?.name || user?.businessName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                      <Link
                        to={role === 'customer' ? '/customer/profile' : '/vendor/profile'}
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Profile Settings</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link to="/services" className="block py-3 px-4 text-gray-700 hover:bg-red-50 rounded-xl" onClick={() => setIsOpen(false)}>Services</Link>
              <Link to="/login" className="block py-3 px-4 text-gray-700 hover:bg-red-50 rounded-xl" onClick={() => setIsOpen(false)}>Customer Login</Link>
              <Link to="/signup" className="block py-3 px-4 bg-red-500 text-white rounded-xl text-center font-semibold" onClick={() => setIsOpen(false)}>Sign Up</Link>
              <Link to="/vendor/login" className="block py-3 px-4 border-2 border-red-500 text-red-600 rounded-xl text-center font-semibold" onClick={() => setIsOpen(false)}>Vendor Login</Link>
            </>
          ) : (
            <>
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-red-50 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
              <Link
                to={role === 'customer' ? '/customer/profile' : '/vendor/profile'}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-red-50 rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="w-full flex items-center space-x-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Backdrop for user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;