import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';

dotenv.config();

const services = [
  {
    id: 'pool-1',
    name: 'Main Swimming Pool',
    type: 'swimming_pool',
    capacity: 50,
    pricePerDay: 3500,
    available: true,
    entranceFeeAdult: 125,
    entranceFeeChildSenior: 100,
    amenities: [
      'Lifeguard',
      'Pool Toys',
      'Shower Facilities',
      'Changing Rooms',
      'Entrance: Adults ₱125; kids (4–12) & seniors ₱100 per person',
    ],
  },
  {
    id: 'pool-2',
    name: 'Kids Swimming Pool',
    type: 'swimming_pool',
    capacity: 20,
    pricePerDay: 2000,
    available: true,
    entranceFeeAdult: 125,
    entranceFeeChildSenior: 100,
    amenities: [
      'Shallow Water',
      'Water Slides',
      'Safety Floats',
      'Entrance: Adults ₱125; kids (4–12) & seniors ₱100 per person',
    ],
  },
  {
    id: 'cottage-1',
    name: 'Cabana',
    type: 'cottage',
    capacity: 8,
    pricePerDay: 400,
    available: true,
    amenities: ['Tables & Chairs', 'Electric Outlet', 'Grill Area'],
  },
  {
    id: 'cottage-2',
    name: 'Gazebo',
    type: 'cottage',
    capacity: 10,
    pricePerDay: 450,
    available: true,
    amenities: ['Tables & Chairs', 'Electric Outlet', 'Grill Area'],
  },
  {
    id: 'cottage-3',
    name: 'Big Cabana',
    type: 'cottage',
    capacity: 15,
    pricePerDay: 700,
    available: true,
    amenities: ['Tables & Chairs', 'Electric Outlet', 'Grill Area'],
  },
  {
    id: 'hall-1',
    name: 'Grand Event Hall',
    type: 'event_hall',
    capacity: 150,
    pricePerDay: 5500,
    available: true,
    lightsAndSoundsFee: 1000,
    paxRates: [
      { minPax: 30, maxPax: 40, price: 5500 },
      { minPax: 41, maxPax: 50, price: 6000 },
      { minPax: 51, maxPax: 60, price: 6500 },
      { minPax: 61, maxPax: 70, price: 7500 },
      { minPax: 71, maxPax: 80, price: 8500 },
      { minPax: 81, maxPax: 90, price: 9500 },
      { minPax: 91, maxPax: 100, price: 10500 },
      { minPax: 101, maxPax: 120, price: 11500 },
      { minPax: 121, maxPax: 140, price: 12500 },
      { minPax: 141, maxPax: 9999, price: 13000 },
    ],
    inclusions: [
      'Use of venue 9am–9pm',
      'Videoke',
      'Tables and chairs without cover (if not provided by client catering)',
      'Guests and visitors may use the swimming pool (pool is shared — not private)',
    ],
    notes: [
      'Additional ₱1,000 for lights and sounds brought in by the guest/client.',
      "Open daily 9am–9pm — AML's Resort.",
    ],
    amenities: ['Videoke', 'Venue use 9am–9pm', 'Shared pool access for guests'],
  },
];

const bookings = [
  {
    id: 'BK001',
    customerName: 'Juan dela Cruz',
    email: 'juan@example.com',
    phone: '0917-123-4567',
    service: 'Cabana',
    checkIn: '2026-03-05',
    checkOut: '2026-03-06',
    guests: 6,
    status: 'confirmed',
    totalAmount: 400,
    createdAt: '2026-02-20',
  },
  {
    id: 'BK002',
    customerName: 'Maria Santos',
    email: 'maria@example.com',
    phone: '0918-234-5678',
    service: 'Grand Event Hall',
    checkIn: '2026-03-10',
    checkOut: '2026-03-10',
    guests: 120,
    status: 'pending',
    totalAmount: 11500,
    createdAt: '2026-02-22',
  },
  {
    id: 'BK003',
    customerName: 'Pedro Reyes',
    email: 'pedro@example.com',
    phone: '0919-345-6789',
    service: 'Main Swimming Pool',
    checkIn: '2026-03-01',
    checkOut: '2026-03-01',
    guests: 30,
    status: 'completed',
    totalAmount: 3500,
    createdAt: '2026-02-15',
  },
  {
    id: 'BK004',
    customerName: 'Ana Garcia',
    email: 'ana@example.com',
    phone: '0920-456-7890',
    service: 'Big Cabana',
    checkIn: '2026-03-08',
    checkOut: '2026-03-09',
    guests: 10,
    status: 'confirmed',
    totalAmount: 1400,
    createdAt: '2026-02-25',
  },
];

const users = [
  {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    name: 'Resort Administrator',
  },
  {
    username: 'employee',
    password: bcrypt.hashSync('employee123', 10),
    role: 'employee',
    name: 'Resort Staff',
  },
];

const seed = async () => {
  try {
    await connectDB();

    for (const user of users) {
      const existingUser = await User.findOne({ username: user.username });
      if (!existingUser) {
        await User.create(user);
      }
    }

    for (const service of services) {
      const existingService = await Service.findOne({ id: service.id });
      if (!existingService) {
        await Service.create(service);
      }
    }

    for (const booking of bookings) {
      const existingBooking = await Booking.findOne({ id: booking.id });
      if (!existingBooking) {
        await Booking.create(booking);
      }
    }

    console.log('Seed data created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

await seed();
