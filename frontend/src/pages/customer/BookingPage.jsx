import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchServiceById } from '../../redux/slices/servicesSlice';
import { createBooking } from '../../redux/slices/bookingsSlice';
import { ArrowLeft, CalendarCheck } from 'lucide-react';

const initialAddress = { street: '', city: '', state: '', pincode: '', landmark: '' };

const BookingPage = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentService: service, isLoading } = useSelector(state => state.services);
  const { createLoading, currentBooking } = useSelector(state => state.bookings);
  const [form, setForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    address: initialAddress,
    notes: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    dispatch(fetchServiceById(serviceId));
  }, [dispatch, serviceId]);

  useEffect(() => {
    if (currentBooking?._id) {
      navigate(`/customer/bookings/${currentBooking._id}`);
    }
  }, [currentBooking, navigate]);

  const totals = useMemo(() => {
    const base = service?.price?.amount || 0;
    const tax = Math.round(base * 0.18);
    return { base, tax, total: base + tax };
  }, [service]);

  const updateAddress = (key, value) => {
    setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!service?.vendor?._id) {
      toast.error('Vendor information is missing for this service');
      return;
    }

    dispatch(createBooking({
      serviceId,
      ...form
    }));
  };

  return (
    <div className="page-container py-8">
      <Link to={`/services/${serviceId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 mb-6">
        <ArrowLeft size={16} />
        Back to service
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="lg:col-span-2 bg-white rounded-2xl shadow-card p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book Service</h1>
            <p className="text-gray-500 text-sm mt-1">Choose your preferred schedule and address.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" required className="input-field" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" required className="input-field" value={form.scheduledTime} onChange={e => setForm(p => ({ ...p, scheduledTime: e.target.value }))} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input-field sm:col-span-2" required placeholder="Street address" value={form.address.street} onChange={e => updateAddress('street', e.target.value)} />
            <input className="input-field" required placeholder="City" value={form.address.city} onChange={e => updateAddress('city', e.target.value)} />
            <input className="input-field" required placeholder="State" value={form.address.state} onChange={e => updateAddress('state', e.target.value)} />
            <input className="input-field" required placeholder="Pincode" maxLength={6} value={form.address.pincode} onChange={e => updateAddress('pincode', e.target.value.replace(/\D/g, ''))} />
            <input className="input-field" placeholder="Landmark" value={form.address.landmark} onChange={e => updateAddress('landmark', e.target.value)} />
          </div>

          <textarea className="input-field min-h-28" placeholder="Notes for the vendor" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />

          <select className="input-field" value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>

          <button disabled={createLoading || isLoading} className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto">
            <CalendarCheck size={18} />
            {createLoading ? 'Creating Booking...' : 'Confirm Booking'}
          </button>
        </form>

        <aside className="bg-white rounded-2xl shadow-card p-6 h-fit">
          <h2 className="font-bold text-gray-900">{service?.title || 'Service summary'}</h2>
          <p className="text-sm text-gray-500 mt-1">{service?.vendor?.businessName}</p>
          <div className="border-t border-gray-100 mt-5 pt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span>Base amount</span><span>Rs {totals.base.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>GST 18%</span><span>Rs {totals.tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3"><span>Total</span><span>Rs {totals.total.toLocaleString()}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingPage;
