import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin, Phone, XCircle } from 'lucide-react';
import { cancelBooking, fetchBookingById, updateBookingStatus } from '../../redux/slices/bookingsSlice';

const actionLabels = {
  accepted: 'Accept Request',
  rejected: 'Reject Request',
  in_progress: 'Start Work',
  completed: 'Mark Completed'
};

const VendorBookingDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBooking: booking, isLoading, updateLoading } = useSelector(state => state.bookings);
  const [notes, setNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    dispatch(fetchBookingById(id));
  }, [dispatch, id]);

  const nextActions = useMemo(() => {
    if (!booking) return [];
    if (booking.status === 'pending') return ['accepted', 'rejected'];
    if (booking.status === 'accepted') return ['in_progress', 'completed'];
    if (booking.status === 'in_progress') return ['completed'];
    return [];
  }, [booking]);

  if (isLoading || !booking) {
    return <div className="page-container py-8"><div className="shimmer h-80 rounded-2xl" /></div>;
  }

  const canCancel = ['pending', 'accepted'].includes(booking.status);

  const handleStatus = (status) => {
    dispatch(updateBookingStatus({ id, status, notes }));
  };

  return (
    <div className="page-container py-8">
      <Link to="/vendor/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 mb-6">
        <ArrowLeft size={16} />
        Back to bookings
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b pb-5">
            <div>
              <p className="text-xs text-gray-400 font-mono">{booking.bookingId}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{booking.service?.title}</h1>
              <p className="text-gray-500 text-sm">From {booking.customer?.name || 'Customer'}</p>
            </div>
            <span className={`badge badge-${booking.status}`}>{booking.status.replace('_', ' ')}</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 py-5 text-sm text-gray-600">
            <p className="flex items-center gap-2"><Calendar size={16} />{new Date(booking.scheduledDate).toLocaleDateString()}</p>
            <p className="flex items-center gap-2"><Clock size={16} />{booking.scheduledTime}</p>
            <p className="flex items-center gap-2"><MapPin size={16} />{booking.address?.city}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Service Address</p>
            <p>{booking.address?.street}</p>
            <p>{booking.address?.city}, {booking.address?.state} - {booking.address?.pincode}</p>
            {booking.address?.landmark && <p>Landmark: {booking.address.landmark}</p>}
          </div>

          {booking.timeline?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-bold text-gray-900 mb-3">Timeline</h2>
              <div className="space-y-3">
                {booking.timeline.map((item, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                    <div>
                      <p className="font-medium text-gray-800">{item.message}</p>
                      <p className="text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-3">Customer</h2>
            <p className="font-medium">{booking.customer?.name}</p>
            <p className="text-sm text-gray-500">{booking.customer?.email}</p>
            {booking.customer?.phone && <p className="flex items-center gap-2 text-sm text-gray-600 mt-2"><Phone size={14} />{booking.customer.phone}</p>}
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Base</span><span>Rs {booking.pricing?.baseAmount?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>Rs {booking.pricing?.taxAmount?.toLocaleString()}</span></div>
              <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span>Rs {booking.pricing?.totalAmount?.toLocaleString()}</span></div>
            </div>
          </div>

          {(nextActions.length > 0 || canCancel) && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-3">Update Request</h2>
              <textarea
                className="input-field min-h-[92px] mb-3"
                placeholder="Optional note"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <div className="grid gap-2">
                {nextActions.map(action => (
                  <button
                    key={action}
                    disabled={updateLoading}
                    onClick={() => handleStatus(action)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold ${action === 'rejected' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                  >
                    {action === 'rejected' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    {actionLabels[action]}
                  </button>
                ))}
              </div>

              {canCancel && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <input
                    className="input-field mb-3"
                    placeholder="Cancellation reason"
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                  />
                  <button
                    className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100"
                    onClick={() => dispatch(cancelBooking({ id, reason: cancelReason }))}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default VendorBookingDetailPage;
