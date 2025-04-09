const mongoose = require('mongoose');

// Union Schema (embedded inside District)
const unionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  seats: {
    type: Number,
    default: 5,
    min: 0,
  },
});

// District Schema
const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  unions: [unionSchema],
}, { timestamps: true });

const District = mongoose.model('District', districtSchema);

// Supervisor Schema
const supervisorSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
  union: {
    type: String, // A single union name within the district
    required: true,
    trim: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  NIDCard: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  password: {
    type: String,
    required: true,
  }
  
}, { timestamps: true });

const Supervisor = mongoose.model('Supervisor', supervisorSchema);

module.exports = { Supervisor, District };
