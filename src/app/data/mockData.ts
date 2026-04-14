// Mock data for the resort management system

import {
  EVENT_HALL_INCLUSIONS,
  EVENT_HALL_NOTES,
  EVENT_HALL_PAX_RATES,
} from '../lib/resortRates';

export interface PaxRateTier {
  minPax: number;
  maxPax: number;
  price: number;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  type: 'swimming_pool' | 'cottage' | 'event_hall';
  capacity: number;
  pricePerDay: number;
  available: boolean;
  amenities: string[];
  image?: string;
  paxRates?: PaxRateTier[];
  inclusions?: string[];
  notes?: string[];
  lightsAndSoundsFee?: number;
  entranceFeeAdult?: number;
  entranceFeeChildSenior?: number;
}

const hallPaxRates: PaxRateTier[] = EVENT_HALL_PAX_RATES.map((t) => ({
  minPax: t.minPax,
  maxPax: t.maxPax,
  price: t.price,
}));

export const services: Service[] = [
  {
    id: 'pool-1',
    name: 'Main Swimming Pool',
    type: 'swimming_pool',
    capacity: 50,
    pricePerDay: 3500,
    available: true,
    entranceFeeAdult: 125,
    entranceFeeChildSenior: 100,
    image: '/images/pool-aerial.jpg',
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
    image: '/images/pool-ground.jpg',
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
    image: '/images/cottage-exterior.jpg',
    amenities: ['Tables & Chairs', 'Electric Outlet', 'Grill Area'],
  },
  {
    id: 'cottage-2',
    name: 'Gazebo',
    type: 'cottage',
    capacity: 10,
    pricePerDay: 450,
    available: true,
    image: '/images/cottage-interior.jpg',
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
    image: '/images/event-hall.jpg',
    paxRates: hallPaxRates,
    inclusions: [...EVENT_HALL_INCLUSIONS],
    notes: [...EVENT_HALL_NOTES],
    lightsAndSoundsFee: 1000,
    amenities: ['Videoke', 'Venue use 9am–9pm', 'Shared pool access for guests'],
  },
];

export const initialBookings: Booking[] = [
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

export const users = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Resort Administrator',
  },
  employee: {
    username: 'employee',
    password: 'employee123',
    role: 'employee',
    name: 'Resort Staff',
  },
};
