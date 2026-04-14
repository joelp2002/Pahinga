import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  guests: { type: Number, required: true },
  status: { type: String, required: true, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  createdAt: { type: String, required: true },
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
