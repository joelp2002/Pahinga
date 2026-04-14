import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '..', 'database.json');

// Simple file-based database for development
class SimpleDB {
  constructor() {
    this.data = {
      users: [
        {
          _id: '1',
          username: 'admin',
          password: '$2a$10$hashedpassword', // bcrypt hash for 'admin123'
          role: 'admin',
          name: 'Resort Administrator',
        },
        {
          _id: '2',
          username: 'employee',
          password: '$2a$10$hashedpassword', // bcrypt hash for 'employee123'
          role: 'employee',
          name: 'Resort Staff',
        },
      ],
      services: [
        {
          _id: '1',
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
          _id: '2',
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
          _id: '3',
          id: 'cottage-1',
          name: 'Cabana',
          type: 'cottage',
          capacity: 8,
          pricePerDay: 400,
          available: true,
          amenities: ['Tables & Chairs', 'Electric Outlet', 'Grill Area'],
        },
        {
          _id: '4',
          id: 'cottage-2',
          name: 'Gazebo',
          type: 'cottage',
          capacity: 10,
          pricePerDay: 450,
          available: true,
          amenities: ['Tables & Chairs', 'Electric Outlet', 'Grill Area'],
        },
        {
          _id: '5',
          id: 'cottage-3',
          name: 'Big Cabana',
          type: 'cottage',
          capacity: 15,
          pricePerDay: 700,
          available: true,
          amenities: ['Tables & Chairs', 'Electric Outlet', 'Grill Area'],
        },
        {
          _id: '6',
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
      ],
      bookings: [
        {
          _id: '1',
          customerName: 'Harvey M. Lunar',
          email: 'harvey@gmail.com',
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
          _id: '2',
          customerName: 'Angela Grace Regencia',
          email: 'angela@gmail.com',
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
          _id: '3',
          customerName: 'James Ashley Largo',
          email: 'james@gmail.com',
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
          _id: '4',
          customerName: 'Tereinz Jhazztine Motol',
          email: 'Jhazztine@gmail.com',
          phone: '0920-456-7890',
          service: 'Big Cabana',
          checkIn: '2026-03-08',
          checkOut: '2026-03-09',
          guests: 10,
          status: 'confirmed',
          totalAmount: 1400,
          createdAt: '2026-02-25',
        },
      ],
    };

    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileData = fs.readFileSync(DB_FILE, 'utf8');
        this.data = { ...this.data, ...JSON.parse(fileData) };
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // User methods
  findUser(query) {
    return this.data.users.find(user =>
      Object.keys(query).every(key => user[key] === query[key])
    );
  }

  // Service methods
  findServices(query = {}) {
    return this.data.services.filter(service =>
      Object.keys(query).every(key => service[key] === query[key])
    );
  }

  updateService(id, updates) {
    const index = this.data.services.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.services[index] = { ...this.data.services[index], ...updates };
      this.save();
      return this.data.services[index];
    }
    return null;
  }

  // Booking methods
  findBookings(query = {}) {
    return this.data.bookings.filter(booking =>
      Object.keys(query).every(key => booking[key] === query[key])
    );
  }

  createBooking(booking) {
    const newBooking = {
      ...booking,
      _id: String(Date.now()),
      id: `BK${String(this.data.bookings.length + 1).padStart(3, '0')}`,
    };
    this.data.bookings.push(newBooking);
    this.save();
    return newBooking;
  }

  updateBooking(id, updates) {
    const index = this.data.bookings.findIndex(b => b.id === id || b._id === id);
    if (index !== -1) {
      this.data.bookings[index] = { ...this.data.bookings[index], ...updates };
      this.save();
      return this.data.bookings[index];
    }
    return null;
  }

  deleteBooking(id) {
    const index = this.data.bookings.findIndex(b => b.id === id || b._id === id);
    if (index !== -1) {
      const deleted = this.data.bookings.splice(index, 1)[0];
      this.save();
      return deleted;
    }
    return null;
  }
}

export default new SimpleDB();