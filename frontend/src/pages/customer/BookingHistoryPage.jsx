import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerBookings } from '../../redux/slices/bookingsSlice';
import BookingCard from '../../components/BookingCard';

const statuses = ['', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'];

const BookingHistoryPage = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, pagination } = useSelector(state => state.bookings);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCustomerBookings({ status: status || undefined, page, limit: 10 }));
  }, [dispatch, status, page]);

  return (
    <div className="page-container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 text-sm">Track every booking in one place.</p>
        </div>
        <select className="input-field sm:w-56" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          {statuses.map(item => (
            <option key={item || 'all'} value={item}>{item ? item.replace('_', ' ') : 'All statuses'}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="shimmer h-32 rounded-2xl" />)}</div>
      ) : bookings.length ? (
        <div className="space-y-3">
          {bookings.map(booking => <BookingCard key={booking._id} booking={booking} />)}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <h2 className="font-bold text-gray-900">No bookings found</h2>
          <p className="text-gray-500 text-sm mt-1">New bookings will show up here.</p>
        </div>
      )}

      {pagination?.total > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button className="btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {pagination.total}</span>
          <button className="btn-outline" disabled={page === pagination.total} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
