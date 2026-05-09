import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchServices } from '../../redux/slices/servicesSlice';
import ServiceCard from '../../components/ServiceCard';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'All', 'Cleaning', 'Electrical', 'Plumbing', 'AC Repair',
  'Carpentry', 'Painting', 'Pest Control', 'Appliance Repair'
];

const ServicesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { services, isLoading, pagination } = useSelector(state => state.services);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    minPrice: '',
    maxPrice: '',
    sort: '-rating.average'
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.city) params.city = filters.city;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    params.sort = filters.sort;
    params.page = page;
    params.limit = 12;

    dispatch(fetchServices(params));
  }, [filters, page, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchServices({ ...filters, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', city: '', minPrice: '', maxPrice: '', sort: '-rating.average' });
    setSearchParams({});
    setPage(1);
  };

  const activeFiltersCount = [filters.search, filters.category, filters.city, filters.minPrice, filters.maxPrice]
    .filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Services</h1>
          <p className="text-gray-500">Find the perfect service professional for your needs</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mt-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 font-medium transition-all ${
                showFilters || activeFiltersCount > 0
                  ? 'border-red-500 text-red-600 bg-red-50'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Pune"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="input-field"
                  >
                    <option value="-rating.average">Top Rated</option>
                    <option value="price.amount">Price: Low to High</option>
                    <option value="-price.amount">Price: High to Low</option>
                    <option value="-createdAt">Newest First</option>
                  </select>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
                >
                  <X size={14} />
                  <span>Clear all filters</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange('category', cat === 'All' ? '' : cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (cat === 'All' && !filters.category) || filters.category === cat
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-gray-500 text-sm">
            {isLoading ? 'Loading...' : `${pagination?.totalRecords || services.length} services found`}
          </p>
          {filters.category && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Category:</span>
              <span className="badge badge-accepted">{filters.category}</span>
              <button onClick={() => handleFilterChange('category', '')} className="text-gray-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="shimmer h-32" />
                <div className="p-5 space-y-3">
                  <div className="shimmer h-4 rounded w-3/4" />
                  <div className="shimmer h-3 rounded" />
                  <div className="shimmer h-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(Math.min(pagination.total, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm ${
                        page === pageNum
                          ? 'bg-red-500 text-white'
                          : 'border-2 border-gray-200 text-gray-600 hover:border-red-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(p => Math.min(pagination.total, p + 1))}
                  disabled={page === pagination.total}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700">No services found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="mt-4 btn-primary">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
