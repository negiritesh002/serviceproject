import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelBooking, fetchBookingById } from '../../redux/slices/bookingsSlice';
import { ArrowLeft, Calendar, Clock, MapPin, Phone } from 'lucide-react';

const BookingDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBooking: booking, isLoading } = useSelector(state => state.bookings);
  const [reason, setReason] = useState('');

  useEffect(() => {
    dispatch(fetchBookingById(id));
  }, [dispatch, id]);

  if (isLoading || !booking) {
    return <div className="page-container py-8"><div className="shimmer h-80 rounded-2xl" /></div>;
  }

  const canCancel = ['pending', 'accepted'].includes(booking.status);

  return (
    <div className="page-container py-8">
      <Link to="/customer/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 mb-6">
        <ArrowLeft size={16} />
        Back to bookings
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b pb-5">
            <div>
              <p className="text-xs text-gray-400 font-mono">{booking.bookingId}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{booking.service?.title}</h1>
              <p className="text-gray-500 text-sm">By {booking.vendor?.businessName}</p>
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
            <h2 className="font-bold text-gray-900 mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Base</span><span>Rs {booking.pricing?.baseAmount?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>Rs {booking.pricing?.taxAmount?.toLocaleString()}</span></div>
              <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span>Rs {booking.pricing?.totalAmount?.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-3">Vendor</h2>
            <p className="font-medium">{booking.vendor?.businessName}</p>
            <p className="text-sm text-gray-500">{booking.vendor?.email}</p>
            {booking.vendor?.phone && <p className="flex items-center gap-2 text-sm text-gray-600 mt-2"><Phone size={14} />{booking.vendor.phone}</p>}
          </div>

          {canCancel && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-3">Cancel Booking</h2>
              <input className="input-field mb-3" placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} />
              <button className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100" onClick={() => dispatch(cancelBooking({ id, reason }))}>
                Cancel Booking
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BookingDetailPage;
