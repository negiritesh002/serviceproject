const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  pricing: {
    baseAmount: Number,
    taxAmount: Number,
    discountAmount: { type: Number, default: 0 },
    totalAmount: Number,
    currency: { type: String, default: 'INR' }
  },
  payment: {
    method: {
      type: String,
      enum: ['online', 'cash', 'upi', 'card'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  notes: {
    customer: String,
    vendor: String,
    admin: String
  },
  timeline: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: String
  }],
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: String,
    ratedAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: String,
    cancelledAt: Date
  },
  completedAt: Date,
  acceptedAt: Date,
  rejectedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.bookingId = `BK-${timestamp}-${random}`;
  }
  next();
});

// Add timeline entry on status change
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const statusMessages = {
      pending: 'Booking request submitted',
      accepted: 'Booking accepted by vendor',
      rejected: 'Booking rejected by vendor',
      in_progress: 'Service is in progress',
      completed: 'Service completed successfully',
      cancelled: 'Booking cancelled'
    };
    
    this.timeline.push({
      status: this.status,
      message: statusMessages[this.status] || `Status updated to ${this.status}`,
      timestamp: new Date()
    });
  }
  next();
});

// Indexes
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ vendor: 1, status: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
