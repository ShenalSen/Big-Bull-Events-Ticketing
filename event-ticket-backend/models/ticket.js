const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  used: { type: Boolean, default: false },
  eventName: { type: String, required: true },
  price: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'used', 'cancelled'], default: 'active' }
});

module.exports = mongoose.model("Ticket", TicketSchema);
