import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceById } from '../../redux/slices/servicesSlice';
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin, Shield, Star } from 'lucide-react';

const priceUnit = {
  fixed: '',
  per_hour: '/hr',
  per_day: '/day',
  per_sqft: '/sqft'
};

const ServiceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentService: service, isLoading, error } = useSelector(state => state.services);
  const { token, role } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchServiceById(id));
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="page-container py-10">
        <div className="shimmer h-80 rounded-2xl" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="page-container py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Service not found</h1>
        <p className="text-gray-500 mt-2">{error || 'This service is no longer available.'}</p>
        <Link to="/services" className="btn-primary inline-flex mt-6">Browse Services</Link>
      </div>
    );
  }

  const vendor = service.vendor;
  const amount = service.price?.amount || 0;
  const vendorCity = vendor?.address?.city;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="page-container py-8">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 mb-6">
          <ArrowLeft size={16} />
          Back to services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8">
              <span className="badge bg-white text-red-600 border border-red-100">{service.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">{service.title}</h1>
              <p className="text-gray-600 mt-3 leading-relaxed">{service.description}</p>

              <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  {(service.rating?.average || 0).toFixed(1)} ({service.rating?.count || 0} reviews)
                </span>
                {service.duration?.min && (
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} />
                    {service.duration.min}-{service.duration.max} {service.duration.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="p-8 space-y-8">
              {service.features?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">What is included</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.requirements?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Before the visit</h2>
                  <div className="space-y-2">
                    {service.requirements.map((item, index) => (
                      <p key={index} className="text-gray-600 flex gap-2">
                        <span className="text-red-500 font-bold">{index + 1}.</span>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <p className="text-sm text-gray-500">Starting at</p>
              <div className="mt-1 flex items-end gap-1">
                <span className="text-4xl font-bold text-gray-900">Rs {amount.toLocaleString()}</span>
                <span className="text-gray-500 mb-1">{priceUnit[service.price?.unit]}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">GST and final total are shown before booking.</p>

              <Link
                to={token && role === 'customer' ? `/customer/book/${service._id}` : '/login'}
                state={{ from: { pathname: `/customer/book/${service._id}` } }}
                className={`btn-primary w-full mt-6 inline-flex items-center justify-center gap-2 ${!vendor?.isAvailable ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              >
                <Calendar size={18} />
                {vendor?.isAvailable ? 'Request This Vendor' : 'Vendor Currently Unavailable'}
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Service Provider</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-orange-400 text-white flex items-center justify-center font-bold">
                  {vendor?.businessName?.[0] || 'V'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{vendor?.businessName || 'Verified vendor'}</p>
                  <p className="text-xs text-gray-500">{vendor?.ownerName}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Shield size={15} className="text-green-500" />
                  {vendor?.isAvailable
                    ? `Open for bookings${vendorCity ? ` in ${vendorCity}` : ''}`
                    : 'Currently unavailable'}
                </p>
                {vendor?.address?.city && (
                  <p className="flex items-center gap-2">
                    <MapPin size={15} className="text-red-500" />
                    {vendor.address.city}, {vendor.address.state}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
