import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { bookingsAPI, servicesAPI, vendorAPI } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import BookingCard from '../../components/BookingCard';
import { Briefcase, Calendar, CheckCircle, IndianRupee, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Appliance Repair', 'Pest Control', 'Landscaping', 'Security', 'Moving', 'Photography', 'Other'];

const emptyService = {
  title: '',
  description: '',
  category: 'Cleaning',
  price: { amount: '', unit: 'fixed' },
  duration: { min: '', max: '', unit: 'hours' },
  featuresText: ''
};

const VendorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, servicesRes, profileRes] = await Promise.all([
        bookingsAPI.getVendorStats(),
        bookingsAPI.getVendorBookings({ limit: 5 }),
        servicesAPI.getVendorServices(),
        vendorAPI.getProfile()
      ]);
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings);
      setServices(servicesRes.data.services);
      setProfile(profileRes.data.vendor);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load vendor dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createService = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      await servicesAPI.create({
        title: form.title,
        description: form.description,
        category: form.category,
        price: { amount: Number(form.price.amount), unit: form.price.unit },
        duration: { min: Number(form.duration.min), max: Number(form.duration.max), unit: form.duration.unit },
        features: form.featuresText.split(',').map(item => item.trim()).filter(Boolean)
      });
      toast.success('Service created');
      setForm(emptyService);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create service');
    } finally {
      setCreating(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await vendorAPI.toggleAvailability();
      setProfile(prev => ({ ...prev, isAvailable: res.data.isAvailable }));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update availability');
    }
  };

  return (
    <div className="page-container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile?.businessName || 'Vendor Dashboard'}</h1>
          <p className="text-gray-500">Manage services, bookings, and availability.</p>
        </div>
        <button onClick={toggleAvailability} className="btn-outline inline-flex items-center gap-2 w-fit">
          {profile?.isAvailable ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} />}
          {profile?.isAvailable ? 'Available' : 'Unavailable'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Bookings" value={loading ? '-' : stats?.total || 0} icon={Calendar} color="blue" />
        <StatsCard title="Pending" value={loading ? '-' : stats?.pending || 0} icon={Briefcase} color="orange" />
        <StatsCard title="Completed" value={loading ? '-' : stats?.completed || 0} icon={CheckCircle} color="green" />
        <StatsCard title="Earnings" value={loading ? '-' : `Rs ${(stats?.totalEarnings || 0).toLocaleString()}`} icon={IndianRupee} color="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link to="/vendor/bookings" className="text-sm font-semibold text-red-600">View all</Link>
            </div>
            <div className="space-y-3">
              {bookings.length ? bookings.map(booking => <BookingCard key={booking._id} booking={booking} role="vendor" />) : (
                <div className="card p-8 text-center text-gray-500">No bookings yet.</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Services</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map(service => (
                <div key={service._id} className="card p-5">
                  <p className="font-bold text-gray-900">{service.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                  <p className="text-lg font-bold text-gray-900 mt-3">Rs {service.price?.amount?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="card p-6 h-fit">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus size={18} />Add Service</h2>
          <form onSubmit={createService} className="space-y-3">
            <input required className="input-field" placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            <textarea required className="input-field min-h-24" placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" className="input-field" placeholder="Price" value={form.price.amount} onChange={e => setForm(p => ({ ...p, price: { ...p.price, amount: e.target.value } }))} />
              <select className="input-field" value={form.price.unit} onChange={e => setForm(p => ({ ...p, price: { ...p.price, unit: e.target.value } }))}>
                <option value="fixed">Fixed</option>
                <option value="per_hour">Per hour</option>
                <option value="per_day">Per day</option>
                <option value="per_sqft">Per sqft</option>
              </select>
              <input required type="number" className="input-field" placeholder="Min hrs" value={form.duration.min} onChange={e => setForm(p => ({ ...p, duration: { ...p.duration, min: e.target.value } }))} />
              <input required type="number" className="input-field" placeholder="Max hrs" value={form.duration.max} onChange={e => setForm(p => ({ ...p, duration: { ...p.duration, max: e.target.value } }))} />
            </div>
            <input className="input-field" placeholder="Features, comma separated" value={form.featuresText} onChange={e => setForm(p => ({ ...p, featuresText: e.target.value }))} />
            <button disabled={creating} className="btn-primary w-full">{creating ? 'Creating...' : 'Create Service'}</button>
          </form>
        </aside>
      </div>
    </div>
  );
};

export default VendorDashboard;
