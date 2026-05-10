import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BookingCard from '../../components/BookingCard';
import { cancelBooking, fetchVendorBookings, updateBookingStatus } from '../../redux/slices/bookingsSlice';

const statuses = ['', 'pending', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled'];
const actionLabels = {
  accepted: 'Accept',
  rejected: 'Reject',
  in_progress: 'Start',
  completed: 'Complete'
};

const VendorBookingsPage = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector(state => state.bookings);
  const [status, setStatus] = useState('');

  useEffect(() => {
    dispatch(fetchVendorBookings({ status: status || undefined, limit: 20 }));
  }, [dispatch, status]);

  const nextActions = (booking) => {
    if (booking.status === 'pending') return ['accepted', 'rejected'];
    if (booking.status === 'accepted') return ['in_progress', 'completed'];
    if (booking.status === 'in_progress') return ['completed'];
    return [];
  };

  return (
    <div className="page-container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Bookings</h1>
          <p className="text-gray-500 text-sm">Accept, reject, and complete assigned work.</p>
        </div>
        <select className="input-field sm:w-56" value={status} onChange={e => setStatus(e.target.value)}>
          {statuses.map(item => <option key={item || 'all'} value={item}>{item ? item.replace('_', ' ') : 'All statuses'}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="shimmer h-32 rounded-2xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="space-y-2">
              <BookingCard booking={booking} role="vendor" />
              {nextActions(booking).length > 0 && (
                <div className="flex gap-2 justify-end">
                  {nextActions(booking).map(action => (
                    <button
                      key={action}
                      onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: action }))}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-red-300 hover:text-red-600"
                    >
                      {actionLabels[action] || action.replace('_', ' ')}
                    </button>
                  ))}
                  {['pending', 'accepted'].includes(booking.status) && (
                    <button
                      onClick={() => dispatch(cancelBooking({ id: booking._id, reason: 'Vendor cancelled the booking' }))}
                      className="px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {!bookings.length && <div className="card p-10 text-center text-gray-500">No bookings found.</div>}
        </div>
      )}
    </div>
  );
};

export default VendorBookingsPage;
