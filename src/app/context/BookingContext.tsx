import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Booking, Service } from '../data/mockData';
import {
  createBookingApi,
  deleteBookingApi,
  getAvailableServicesApi,
  getBookingsApi,
  getServicesApi,
  updateBookingStatusApi,
  updateServiceAvailabilityApi,
} from '../services/api';

interface BookingContextType {
  bookings: Booking[];
  services: Service[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<Booking>;
  deleteBooking: (id: string) => Promise<void>;
  updateServiceAvailability: (id: string, available: boolean) => Promise<Service>;
  fetchAvailableServices: (checkIn: string, checkOut: string, serviceType?: string) => Promise<Service[]>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const loadBookings = useCallback(async () => {
    try {
      const data = await getBookingsApi();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings', error);
    }
  }, []);

  const loadServices = useCallback(async () => {
    try {
      const data = await getServicesApi();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services', error);
    }
  }, []);

  useEffect(() => {
    loadBookings();
    loadServices();
  }, [loadBookings, loadServices]);

  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking = await createBookingApi(booking);
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    const updatedBooking = await updateBookingStatusApi(id, status);
    setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    return updatedBooking;
  };

  const deleteBooking = async (id: string) => {
    await deleteBookingApi(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const updateServiceAvailability = async (id: string, available: boolean) => {
    const updatedService = await updateServiceAvailabilityApi(id, available);
    setServices((prev) => prev.map((s) => (s.id === updatedService.id ? updatedService : s)));
    return updatedService;
  };

  const fetchAvailableServices = useCallback(
    async (checkIn: string, checkOut: string, serviceType = 'all') => {
      return await getAvailableServicesApi(checkIn, checkOut, serviceType);
    },
    []
  );

  return (
    <BookingContext.Provider
      value={{
        bookings,
        services,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        updateServiceAvailability,
        fetchAvailableServices,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
