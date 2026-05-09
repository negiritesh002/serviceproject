import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { vendorAPI } from '../../services/api';

const VendorProfilePage = () => {
  const [form, setForm] = useState({ businessName: '', ownerName: '', description: '', isAvailable: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    vendorAPI.getProfile().then(res => {
      const vendor = res.data.vendor;
      setForm({
        businessName: vendor.businessName || '',
        ownerName: vendor.ownerName || '',
        description: vendor.description || '',
        isAvailable: vendor.isAvailable
      });
    });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await vendorAPI.updateProfile(form);
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
          <h1 className="text-2xl font-bold text-gray-900">Vendor Profile</h1>
          <p className="text-gray-500 text-sm">Update the business details customers see.</p>
        </div>
        <input required className="input-field" placeholder="Business name" value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} />
        <input required className="input-field" placeholder="Owner name" value={form.ownerName} onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} />
        <textarea className="input-field min-h-32" placeholder="Business description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} />
          Available for new bookings
        </label>
        <button disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Profile'}</button>
      </form>
    </div>
  );
};

export default VendorProfilePage;
