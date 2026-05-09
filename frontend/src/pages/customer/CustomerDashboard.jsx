import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { customerAPI } from '../../services/api';
import { fetchCustomerBookings } from '../../redux/slices/bookingsSlice';
import StatsCard from '../../components/StatsCard';
import BookingCard from '../../components/BookingCard';
import {
  Calendar, CheckCircle, Clock, XCircle,
  ShoppingBag, TrendingUp, ArrowRight, Zap
} from 'lucide-react';
import { useState } from 'react';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { bookings, isLoading } = useSelector(state => state.bookings);
  const [stats, setStats] = useState(null);
  const [dashLoading, setDashLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchCustomerBookings({ limit: 5 }));
    
    customerAPI.getDashboard().then(res => {
      setStats(res.data.stats);
    }).catch(() => {}).finally(() => setDashLoading(false));
  }, [dispatch]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {greeting}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Welcome to your ServiceBook dashboard</p>
          </div>
          <Link
            to="/services"
            className="mt-4 md:mt-0 btn-primary flex items-center space-x-2 w-fit"
          >
            <Zap size={18} />
            <span>Book a Service</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Bookings"
          value={dashLoading ? '—' : stats?.total || 0}
          icon={Calendar}
          color="red"
        />
        <StatsCard
          title="Pending"
          value={dashLoading ? '—' : stats?.pending || 0}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Completed"
          value={dashLoading ? '—' : stats?.completed || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Total Spent"
          value={dashLoading ? '—' : `₹${(stats?.totalSpent || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <Link
              to="/customer/bookings"
              className="flex items-center space-x-1 text-red-600 text-sm font-semibold hover:text-red-700"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-5">
                  <div className="shimmer h-20 rounded" />
                </div>
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 5).map(booking => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">No bookings yet</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">Book your first service today!</p>
              <Link to="/services" className="btn-primary inline-flex items-center space-x-2">
                <Zap size={16} />
                <span>Browse Services</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>

          <div className="card p-5 space-y-3">
            {[
              { icon: '🧹', label: 'Book Cleaning', to: '/services?category=Cleaning', color: 'bg-blue-50' },
              { icon: '⚡', label: 'Electrical Work', to: '/services?category=Electrical', color: 'bg-yellow-50' },
              { icon: '🔧', label: 'Plumbing', to: '/services?category=Plumbing', color: 'bg-cyan-50' },
              { icon: '❄️', label: 'AC Service', to: '/services?category=AC Repair', color: 'bg-sky-50' },
            ].map(({ icon, label, to, color }) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center space-x-3 p-3 ${color} rounded-xl hover:opacity-80 transition-all group`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
                <ArrowRight size={16} className="text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>

          {/* Profile Summary */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Your Profile</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">{user?.name?.[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/customer/profile"
              className="block w-full text-center py-2 border-2 border-gray-200 text-gray-600 rounded-xl hover:border-red-300 hover:text-red-600 transition-all text-sm font-medium"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;