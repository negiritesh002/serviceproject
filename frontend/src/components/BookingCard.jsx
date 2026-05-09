import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  pending: { label: 'Pending', class: 'badge-pending', icon: '⏳' },
  accepted: { label: 'Accepted', class: 'badge-accepted', icon: '✅' },
  in_progress: { label: 'In Progress', class: 'badge-in_progress', icon: '🔄' },
  completed: { label: 'Completed', class: 'badge-completed', icon: '🎉' },
  rejected: { label: 'Rejected', class: 'badge-rejected', icon: '❌' },
  cancelled: { label: 'Cancelled', class: 'badge-cancelled', icon: '🚫' }
};

const BookingCard = ({ booking, role = 'customer' }) => {
  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const service = booking.service;
  const vendor = booking.vendor;
  const customer = booking.customer;

  return (
    <Link to={`/customer/bookings/${booking._id}`} className="block">
      <div className="card p-5 hover:shadow-card-hover transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {booking.service?.category === 'Cleaning' ? '🧹' :
               booking.service?.category === 'Electrical' ? '⚡' :
               booking.service?.category === 'Plumbing' ? '🔧' :
               booking.service?.category === 'AC Repair' ? '❄️' : '🛠️'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {service?.title || 'Service'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {role === 'customer' ? `By ${vendor?.businessName || 'Vendor'}` : `From ${customer?.name || 'Customer'}`}
              </p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{booking.bookingId}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`badge ${statusConfig.class}`}>
              <span className="mr-1">{statusConfig.icon}</span>
              {statusConfig.label}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1.5">
            <Calendar size={12} className="text-red-400" />
            <span>{format(new Date(booking.scheduledDate), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock size={12} className="text-red-400" />
            <span>{booking.scheduledTime}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <MapPin size={12} className="text-red-400" />
            <span className="truncate">{booking.address?.city}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-400">Total Amount</span>
          <span className="font-bold text-gray-900">
            ₹{booking.pricing?.totalAmount?.toLocaleString() || '0'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookingCard;