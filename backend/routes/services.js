import express from 'express';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let services;
    if (global.simpleDB) {
      services = global.simpleDB.findServices();
    } else {
      services = await Service.find().sort({ name: 1 });
    }
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load services', error: error.message });
  }
});

router.get('/available', async (req, res) => {
  try {
    const { checkIn, checkOut, serviceType = 'all' } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'checkIn and checkOut query parameters are required' });
    }

    const query = { available: true };
    if (serviceType && serviceType !== 'all') {
      query.type = serviceType;
    }

    let services, bookings;
    if (global.simpleDB) {
      services = global.simpleDB.findServices(query);
      bookings = global.simpleDB.findBookings().filter(b => b.status !== 'cancelled');
    } else {
      services = await Service.find(query).sort({ name: 1 });
      bookings = await Booking.find({ status: { $ne: 'cancelled' } });
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const availableServices = services.filter((service) => {
      const hasConflict = bookings.some((booking) => {
        if (booking.service !== service.name) return false;

        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);

        return start <= bookingEnd && end >= bookingStart;
      });

      return !hasConflict;
    });

    return res.json(availableServices);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to compute available services', error: error.message });
  }
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { available } = req.body;
    let service;
    if (global.simpleDB) {
      service = global.simpleDB.findServices({ id: req.params.id })[0];
      if (service) {
        service = global.simpleDB.updateService(req.params.id, { available: Boolean(available) });
      }
    } else {
      service = await Service.findOne({ id: req.params.id });
      if (service) {
        service.available = Boolean(available);
        await service.save();
      }
    }
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update service availability', error: error.message });
  }
});

export default router;
