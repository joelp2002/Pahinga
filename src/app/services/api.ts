import type { Booking, Service } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const getToken = () => localStorage.getItem('pahinga_token');

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || response.statusText || 'API request failed');
  }

  return data;
};

export interface LoginResponse {
  token: string;
  user: { username: string; role: 'admin' | 'employee'; name: string };
}

export interface RegisterResponse {
  message: string;
  user: { username: string; role: 'admin' | 'employee'; name: string };
}

export const loginApi = (username: string, password: string) =>
  request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const registerApi = (username: string, password: string, name: string, role: 'admin' | 'employee' = 'employee') =>
  request<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, name, role }),
  });

export const getBookingsApi = () => request<Booking[]>('/api/bookings');
export const createBookingApi = (booking: Omit<Booking, 'id' | 'createdAt'>) =>
  request<Booking>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  });
export const updateBookingStatusApi = (id: string, status: Booking['status']) =>
  request<Booking>(`/api/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
export const deleteBookingApi = (id: string) =>
  request<{ message: string }>(`/api/bookings/${id}`, { method: 'DELETE' });

export const getServicesApi = () => request<Service[]>('/api/services');
export const getAvailableServicesApi = (
  checkIn: string,
  checkOut: string,
  serviceType = 'all'
) =>
  request<Service[]>(
    `/api/services/available?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&serviceType=${encodeURIComponent(serviceType)}`
  );
export const updateServiceAvailabilityApi = (id: string, available: boolean) =>
  request<Service>(`/api/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ available }),
  });
