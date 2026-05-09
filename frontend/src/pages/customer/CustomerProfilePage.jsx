import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { customerAPI } from '../../services/api';

const CustomerProfilePage = () => {
  const [form, setForm] = useState({ name: '', email: '', address: { street: '', city: '', state: '', pincode: '' } });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    customerAPI.getProfile().then(res => {
      const customer = res.data.customer;
      setForm({
        name: customer.name || '',
        email: customer.email || '',
        address: { street: '', city: '', state: '', pincode: '', ...customer.address }
      });
    });
  }, []);

  const updateAddress = (key, value) => setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await customerAPI.updateProfile(form);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container py-8">
      <form onSubmit={submit} className="max-w-3xl card p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 text-sm">Keep your contact and address details current.</p>
        </div>
        <input className="input-field" required placeholder="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        <input className="input-field" required type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="input-field sm:col-span-2" placeholder="Street" value={form.address.street} onChange={e => updateAddress('street', e.target.value)} />
          <input className="input-field" placeholder="City" value={form.address.city} onChange={e => updateAddress('city', e.target.value)} />
          <input className="input-field" placeholder="State" value={form.address.state} onChange={e => updateAddress('state', e.target.value)} />
          <input className="input-field" placeholder="Pincode" value={form.address.pincode} onChange={e => updateAddress('pincode', e.target.value.replace(/\D/g, ''))} />
        </div>
        <button disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Profile'}</button>
      </form>
    </div>
  );
};

export default CustomerProfilePage;
