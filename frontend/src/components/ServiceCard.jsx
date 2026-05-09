import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ArrowRight, Shield } from 'lucide-react';

const categoryIcons = {
  'Cleaning': '🧹',
  'Electrical': '⚡',
  'Plumbing': '🔧',
  'AC Repair': '❄️',
  'Carpentry': '🪚',
  'Painting': '🎨',
  'Pest Control': '🐛',
  'Appliance Repair': '🔌',
  'Landscaping': '🌿',
  'Security': '🔒',
  'Moving': '📦',
  'Photography': '📷',
  'Other': '🛠️'
};

const ServiceCard = ({ service }) => {
  const icon = categoryIcons[service.category] || '🛠️';

  return (
    <div className="card overflow-hidden group cursor-pointer">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 pb-4">
        {service.isFeatured && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            ⭐ Featured
          </span>
        )}
        <div className="text-5xl mb-3">{icon}</div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-red-600 border border-red-100">
          {service.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
          {service.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Vendor Info */}
        {service.vendor && (
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-7 h-7 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {service.vendor.businessName?.[0] || 'V'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800">{service.vendor.businessName}</p>
              <div className="flex items-center space-x-1">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-xs text-gray-500">
                  {service.vendor.rating?.average?.toFixed(1) || '4.5'} ({service.vendor.rating?.count || 0} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${service.vendor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-xs ${service.vendor.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {service.vendor.isAvailable ? 'Available for booking' : 'Currently unavailable'}
                </span>
              </div>
              {service.vendor.address?.city && (
                <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                  <MapPin size={10} />
                  <span>{service.vendor.address.city}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {service.features.slice(0, 2).map((feature, i) => (
              <span key={i} className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                <Shield size={10} className="text-green-500" />
                <span>{feature}</span>
              </span>
            ))}
          </div>
        )}

        {/* Duration */}
        {service.duration && (
          <div className="flex items-center space-x-1 text-gray-500 text-xs mb-4">
            <Clock size={12} />
            <span>{service.duration.min}-{service.duration.max} {service.duration.unit}</span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Starting at</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">
                ₹{service.price.amount.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">
                {service.price.unit === 'fixed' ? '' :
                 service.price.unit === 'per_hour' ? '/hr' :
                 service.price.unit === 'per_day' ? '/day' : '/sqft'}
              </span>
            </div>
          </div>
          {service.vendor?.isAvailable ? (
            <Link
              to={`/services/${service._id}`}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all group-hover:shadow-md"
            >
              <span>Book Now</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center space-x-1.5 bg-gray-300 text-gray-500 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-not-allowed"
            >
              <span>Unavailable</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
