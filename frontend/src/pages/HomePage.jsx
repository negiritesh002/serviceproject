import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, fetchCategories } from '../redux/slices/servicesSlice';
import ServiceCard from '../components/ServiceCard';
import {
  Search, MapPin, ChevronRight, Star, Shield,
  Clock, Headphones, Award, ArrowRight, CheckCircle,
  Users, TrendingUp, Zap
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Cleaning', icon: '🧹', color: 'from-blue-500 to-blue-600', count: '500+' },
  { name: 'Electrical', icon: '⚡', color: 'from-yellow-500 to-orange-500', count: '300+' },
  { name: 'Plumbing', icon: '🔧', color: 'from-cyan-500 to-blue-500', count: '400+' },
  { name: 'AC Repair', icon: '❄️', color: 'from-sky-500 to-cyan-500', count: '200+' },
  { name: 'Painting', icon: '🎨', color: 'from-pink-500 to-rose-500', count: '150+' },
  { name: 'Pest Control', icon: '🐛', color: 'from-green-600 to-teal-600', count: '120+' },
  { name: 'Carpentry', icon: '🪚', color: 'from-amber-600 to-orange-600', count: '180+' },
  { name: 'Appliance Repair', icon: '🔌', color: 'from-purple-500 to-indigo-500', count: '250+' }
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    city: 'Mumbai',
    rating: 5,
    review: 'Excellent service! The cleaning team was professional and thorough. Highly recommend ServiceBook!',
    service: 'Home Cleaning',
    avatar: 'PS'
  },
  {
    name: 'Rohit Gupta',
    city: 'Delhi',
    rating: 5,
    review: 'Quick response and quality work. The electrician fixed my wiring issue in just 2 hours.',
    service: 'Electrical',
    avatar: 'RG'
  },
  {
    name: 'Anita Patel',
    city: 'Bangalore',
    rating: 5,
    review: 'Very reliable platform. Booked AC repair service and the technician arrived on time!',
    service: 'AC Repair',
    avatar: 'AP'
  }
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, isLoading } = useSelector(state => state.services);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    dispatch(fetchServices({ limit: 8, featured: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${searchQuery}&city=${location}`);
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Zap size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">India's #1 On-Demand Service Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Book Home Services
              <span className="block text-yellow-300 mt-1">In Minutes!</span>
            </h1>

            <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get expert professionals for cleaning, repairs, and more.
              100% verified, insured, and background-checked.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-2xl">
              <div className="flex items-center flex-1 px-4 py-2">
                <Search size={20} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="flex-1 ml-3 text-gray-800 placeholder-gray-400 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center px-4 py-2 border-l border-gray-200 md:w-48">
                <MapPin size={20} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Your city"
                  className="flex-1 ml-3 text-gray-800 placeholder-gray-400 outline-none text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn-primary rounded-xl md:rounded-xl whitespace-nowrap"
              >
                Search Services
              </button>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              <span className="text-red-200 text-sm">Popular:</span>
              {['AC Service', 'Home Cleaning', 'Plumber', 'Electrician'].map(term => (
                <button
                  key={term}
                  onClick={() => navigate(`/services?search=${term}`)}
                  className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path d="M0,80L1440,20L1440,80L0,80Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: '2M+ Customers', sub: 'Served across India', color: 'text-red-500' },
              { icon: Award, label: '50K+ Experts', sub: 'Verified professionals', color: 'text-orange-500' },
              { icon: Star, label: '4.8/5 Rating', sub: 'Average rating', color: 'text-yellow-500' },
              { icon: Shield, label: '100% Insured', sub: 'Work guarantee', color: 'text-green-500' }
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="flex items-center space-x-3">
                <Icon size={28} className={color} />
                <div>
                  <p className="font-bold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">What Are You Looking For?</h2>
            <p className="section-subtitle">Choose from our wide range of professional services</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map(({ name, icon, color }) => (
              <Link
                key={name}
                to={`/services?category=${name}`}
                className="group text-center"
              >
                <div className={`w-full aspect-square bg-gradient-to-br ${color} rounded-2xl flex flex-col items-center justify-center mb-2 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
                  <span className="text-4xl mb-1">{icon}</span>
                  <span className="text-white text-xs font-medium hidden sm:block">{name}</span>
                </div>
                <p className="text-xs font-semibold text-gray-700 sm:hidden">{name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="section-title">Featured Services</h2>
              <p className="section-subtitle">Handpicked top-rated services for you</p>
            </div>
            <Link
              to="/services"
              className="flex items-center space-x-1 text-red-600 font-semibold hover:text-red-700"
            >
              <span>View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="shimmer h-36" />
                  <div className="p-5 space-y-3">
                    <div className="shimmer h-4 w-3/4 rounded" />
                    <div className="shimmer h-3 rounded" />
                    <div className="shimmer h-3 w-2/3 rounded" />
                    <div className="flex justify-between">
                      <div className="shimmer h-6 w-20 rounded" />
                      <div className="shimmer h-9 w-24 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-700">No Services Available</h3>
              <p className="text-gray-500 mt-2">Services will appear here once vendors add them</p>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            <p className="text-gray-400 mt-2 text-lg">Book a service in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-red-500 to-orange-500" />

            {[
              {
                step: '01',
                title: 'Choose a Service',
                desc: 'Browse our wide range of services and pick what you need',
                icon: '🔍',
                color: 'from-red-500 to-red-600'
              },
              {
                step: '02',
                title: 'Book & Schedule',
                desc: 'Select date, time and enter your address to confirm booking',
                icon: '📅',
                color: 'from-orange-500 to-orange-600'
              },
              {
                step: '03',
                title: 'Service Delivered',
                desc: 'Expert arrives, delivers service and marks complete',
                icon: '✅',
                color: 'from-green-500 to-green-600'
              }
            ].map(({ step, title, desc, icon, color }) => (
              <div key={step} className="text-center relative">
                <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}>
                  {icon}
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-white text-gray-900 rounded-full text-sm font-bold mb-3">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="btn-primary inline-flex items-center space-x-2">
              <span>Get Started Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose ServiceBook?</h2>
            <p className="section-subtitle">We make home services safe, simple and reliable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Professionals',
                desc: 'All our service experts are background-checked and verified',
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                icon: Award,
                title: 'Quality Guaranteed',
                desc: 'Not satisfied? We will redo the service for free',
                color: 'text-green-600',
                bg: 'bg-green-50'
              },
              {
                icon: Clock,
                title: 'On-Time Service',
                desc: 'Our professionals arrive on time, every time',
                color: 'text-orange-600',
                bg: 'bg-orange-50'
              },
              {
                icon: Headphones,
                title: '24/7 Support',
                desc: 'Our customer support team is always here to help',
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              }
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card p-6 text-center">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={26} className={color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Thousands of happy customers across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-5 italic">"{t.review}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.city} · {t.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book a Service?
          </h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Join 2 million+ satisfied customers. Get expert service professionals at your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-red-600 font-bold px-8 py-4 rounded-2xl hover:bg-red-50 transition-all shadow-lg text-lg"
            >
              Book Now — It's Free
            </Link>
            <Link
              to="/vendor/signup"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all text-lg"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;