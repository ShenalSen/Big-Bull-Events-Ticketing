const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return v === process.env.ADMIN_INITIAL_USERNAME;
      },
      message: "Cannot modify default admin username"
    }
  },
  password: { type: String, required: true }
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Check if this is the only admin document
  const count = await this.constructor.countDocuments({});
  if (count > 0 && !this._id) {
    throw new Error('Only one admin account is allowed');
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);