import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const overlaps = (startA, endA, startB, endB) => {
  return startA <= endB && endA >= startB;
};

router.get('/', async (req, res) => {
  try {
    let bookings;
    if (global.simpleDB) {
      bookings = global.simpleDB.findBookings();
    } else {
      bookings = await Booking.find().sort({ createdAt: -1 });
    }
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load bookings', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, service, checkIn, checkOut, guests, status, totalAmount } = req.body;
    if (!customerName || !email || !phone || !service || !checkIn || !checkOut || !guests || !totalAmount) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    let existingService;
    if (global.simpleDB) {
      existingService = global.simpleDB.findServices({ name: service, available: true })[0];
    } else {
      existingService = await Service.findOne({ name: service, available: true });
    }
    if (!existingService) {
      return res.status(400).json({ message: 'Selected service is not available' });
    }

    let bookings;
    if (global.simpleDB) {
      bookings = global.simpleDB.findBookings().filter(b => b.status !== 'cancelled');
    } else {
      bookings = await Booking.find({ status: { $ne: 'cancelled' } });
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const conflict = bookings.some((booking) => {
      if (booking.service !== service) return false;

      const bookingStart = new Date(booking.checkIn);
      const bookingEnd = new Date(booking.checkOut);
      return overlaps(start, end, bookingStart, bookingEnd);
    });

    if (conflict) {
      return res.status(409).json({ message: 'Selected service is already booked on those dates' });
    }

    const createdAt = new Date().toISOString().split('T')[0];
    let booking;
    if (global.simpleDB) {
      booking = global.simpleDB.createBooking({
        customerName,
        email,
        phone,
        service,
        checkIn,
        checkOut,
        guests,
        status: status || 'pending',
        totalAmount,
        createdAt,
      });
    } else {
      booking = await Booking.create({
        id: `BK${Date.now().toString().slice(-6)}`,
        customerName,
        email,
        phone,
        service,
        checkIn,
        checkOut,
        guests,
        status: status || 'pending',
        totalAmount,
        createdAt,
      });
    }

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    let booking;
    if (global.simpleDB) {
      booking = global.simpleDB.updateBooking(req.params.id, { status });
    } else {
      booking = await Booking.findOneAndUpdate(
        { id: req.params.id },
        { status },
        { new: true }
      );
    }
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update booking status', error: error.message });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    let booking;
    if (global.simpleDB) {
      booking = global.simpleDB.deleteBooking(req.params.id);
    } else {
      booking = await Booking.findOneAndDelete({ id: req.params.id });
    }
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.json({ message: 'Booking removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
});

export default router;
