const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Plumbing', 'Electrical', 'Cleaning', 'Carpentry',
      'Painting', 'AC Repair', 'Appliance Repair', 'Pest Control',
      'Landscaping', 'Security', 'Moving', 'Photography', 'Other'
    ]
  },
  subcategory: String,
  price: {
    amount: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    unit: {
      type: String,
      enum: ['fixed', 'per_hour', 'per_day', 'per_sqft'],
      default: 'fixed'
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  duration: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'hours'
    }
  },
  images: [String],
  icon: String,
  features: [String],
  requirements: [String],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  bookingsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Service', serviceSchema);