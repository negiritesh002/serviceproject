const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Customer = require('../models/Customer.model');
const Vendor = require('../models/Vendor.model');
const Service = require('../models/Service.model');

const services = [
  {
    title: 'Home Deep Cleaning',
    description: 'Complete deep cleaning service for your entire home. Includes dusting, mopping, bathroom sanitization, kitchen degreasing, and window cleaning.',
    category: 'Cleaning',
    price: { amount: 1499, unit: 'fixed' },
    duration: { min: 3, max: 6, unit: 'hours' },
    features: ['All rooms covered', 'Eco-friendly products', 'Equipment included', 'Trained staff'],
    isFeatured: true,
    tags: ['cleaning', 'home', 'deep-clean']
  },
  {
    title: 'AC Service & Repair',
    description: 'Professional AC servicing including gas refilling, filter cleaning, PCB repair, and annual maintenance contract.',
    category: 'AC Repair',
    price: { amount: 699, unit: 'fixed' },
    duration: { min: 1, max: 2, unit: 'hours' },
    features: ['All brands serviced', 'Genuine spare parts', '30-day warranty', 'Doorstep service'],
    isFeatured: true,
    tags: ['AC', 'repair', 'servicing']
  },
  {
    title: 'Electrical Wiring & Repair',
    description: 'Licensed electricians for all your electrical needs - wiring, switch installation, fan fitting, inverter installation and repairs.',
    category: 'Electrical',
    price: { amount: 399, unit: 'per_hour' },
    duration: { min: 1, max: 4, unit: 'hours' },
    features: ['Licensed electricians', 'Safety certified', 'All repairs covered', '1-year warranty'],
    isFeatured: true,
    tags: ['electrical', 'wiring', 'repair']
  },
  {
    title: 'Plumbing Services',
    description: 'Expert plumbing services for leakage repair, pipe fitting, tap installation, water heater installation, and drainage cleaning.',
    category: 'Plumbing',
    price: { amount: 299, unit: 'per_hour' },
    duration: { min: 1, max: 3, unit: 'hours' },
    features: ['Emergency service', 'All types of pipes', 'Genuine fittings', 'Neat work'],
    tags: ['plumbing', 'pipe', 'leakage']
  },
  {
    title: 'Home Painting',
    description: 'Professional interior and exterior painting services. Quality paints, smooth finish, and on-time delivery guaranteed.',
    category: 'Painting',
    price: { amount: 15, unit: 'per_sqft' },
    duration: { min: 1, max: 5, unit: 'days' },
    features: ['Premium paints', 'All colors available', 'Surface preparation', 'Clean work'],
    isFeatured: true,
    tags: ['painting', 'interior', 'exterior']
  },
  {
    title: 'Pest Control Service',
    description: 'Comprehensive pest control treatment for cockroaches, ants, rats, bed bugs, and mosquitoes. Safe for family and pets.',
    category: 'Pest Control',
    price: { amount: 999, unit: 'fixed' },
    duration: { min: 1, max: 2, unit: 'hours' },
    features: ['Safe chemicals', 'Long-lasting effect', '3-month guarantee', 'All pests covered'],
    tags: ['pest', 'cockroach', 'rat', 'bedbugs']
  },
  {
    title: 'Furniture Assembly',
    description: 'Expert furniture assembly and installation service. IKEA, Pepperfry, Urban Ladder, and all other brands assembled professionally.',
    category: 'Carpentry',
    price: { amount: 499, unit: 'fixed' },
    duration: { min: 1, max: 3, unit: 'hours' },
    features: ['All brands', 'Tools provided', 'Careful handling', 'Quick assembly'],
    tags: ['furniture', 'assembly', 'carpentry']
  },
  {
    title: 'Appliance Repair',
    description: 'Expert repair for all home appliances - washing machine, refrigerator, microwave, dishwasher, and more.',
    category: 'Appliance Repair',
    price: { amount: 349, unit: 'fixed' },
    duration: { min: 1, max: 2, unit: 'hours' },
    features: ['All brands', 'Genuine parts', '60-day warranty', 'Quick repair'],
    isFeatured: true,
    tags: ['appliance', 'repair', 'washing machine', 'refrigerator']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Customer.deleteMany({});
    await Vendor.deleteMany({});
    await Service.deleteMany({});
    console.log('Cleared existing data');

    // Create demo vendor
    const vendor = await Vendor.create({
      businessName: 'QuickFix Services Pro',
      ownerName: 'Rajesh Kumar',
      email: 'vendor@demo.com',
      phone: '9876543210',
      password: 'Vendor@123',
      category: 'Cleaning',
      description: 'Professional home services company with 10+ years of experience',
      address: { city: 'Mumbai', state: 'Maharashtra' },
      isVerified: true,
      isApproved: true,
      rating: { average: 4.5, count: 127 }
    });

    console.log('✅ Demo vendor created:', vendor.email);

    // Create demo customer
    const customer = await Customer.create({
      name: 'Priya Sharma',
      email: 'customer@demo.com',
      phone: '9123456780',
      password: 'Customer@123',
      isVerified: true,
      address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
    });

    console.log('✅ Demo customer created:', customer.email);

    // Create services with vendor reference
    const servicesWithVendor = services.map(s => ({ ...s, vendor: vendor._id }));
    await Service.insertMany(servicesWithVendor);
    console.log(`✅ ${services.length} demo services created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Demo Credentials:');
    console.log('Customer: customer@demo.com / Customer@123');
    console.log('Vendor:   vendor@demo.com   / Vendor@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();