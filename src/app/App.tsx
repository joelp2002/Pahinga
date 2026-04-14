import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <RouterProvider router={router} />
        <Toaster />
      </BookingProvider>
    </AuthProvider>
  );
}
