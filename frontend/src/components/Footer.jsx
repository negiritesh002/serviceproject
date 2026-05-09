import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="text-xl font-bold text-white">ServiceBook</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's most trusted on-demand service platform. Connecting customers with verified service professionals.
            </p>
            <div className="flex space-x-3 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {['Home Cleaning', 'Electrical', 'Plumbing', 'AC Repair', 'Pest Control', 'Painting'].map(service => (
                <li key={service}>
                  <Link to="/services" className="text-sm hover:text-red-400 transition-colors">{service}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Blog', 'Press', 'Terms of Service', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-red-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">1st Floor, Tech Park, Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-sm">1800-XXX-XXXX (Toll Free)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-sm">support@servicebook.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2024 ServiceBook. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-500">Download App:</span>
            <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
              App Store
            </button>
            <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
              Google Play
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;