const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  cnic: {
    type: String,
    required: [true, 'CNIC is required'],
    unique: true,
    match: [/^\d{13}$/, 'CNIC must be exactly 13 digits']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{11}$/, 'Phone number must be exactly 11 digits']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [300, 'Address cannot exceed 300 characters']
  },
  program: {
    type: String,
    required: [true, 'Program selection is required'],
    enum: [
      'web-development',
      'mobile-app-development', 
      'artificial-intelligence',
      'graphic-design',
      'digital-marketing',
      'data-science',
      'cybersecurity',
      'cloud-computing'
    ]
  },
  registrationId: {
    type: String,
    unique: true,
    required: true
  },
  idCardGenerated: {
    type: Boolean,
    default: false
  },
  whatsappSent: {
    type: Boolean,
    default: false
  },
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate registration ID before saving
userSchema.pre('save', function(next) {
  if (!this.registrationId) {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.registrationId = `SYL${timestamp}${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);