// Model definition for UserAddress
const mongoose = require('mongoose');

const userAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addressType: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    required: true
  },
  fullAddress: {
    type: String,
    required: true
  },
  flatNumber:{
    type: String,
  },
  landmark:   {type: String},
  area: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  deliveryPreference: {
    leaveAtDoor: {
      type: Boolean,
      default: false
    },
    avoidCalling: {
      type: Boolean,
      default: false
    },
    deliveryInstructions: String,
    preferredDeliveryWindow: {
      start: String,
      end: String
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
 latitude:{
    type: Number,
 },
 longitude:{
    type: Number,
 },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const UserAddress = mongoose.model('UserAddress', userAddressSchema);
module.exports = { UserAddress };