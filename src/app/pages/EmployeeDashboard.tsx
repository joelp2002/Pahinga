import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Waves,
  LogOut,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Search,
  Home,
  Building2,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { bookings, services, updateBookingStatus } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'employee') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBookingStatus(bookingId, newStatus as any);
    toast.success('Booking status updated');
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const todaysBookings = bookings.filter((b) => {
    const today = new Date().toISOString().split('T')[0];
    return b.checkIn === today;
  }).length;

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      confirmed: 'bg-green-100 text-green-800 hover:bg-green-100',
      completed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
    };
    return <Badge className={styles[status as keyof typeof styles] || ''}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Waves className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">PAHINGA - Staff</h1>
              <p className="text-xs text-gray-600">Employee Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <Badge variant="outline" className="text-xs">Staff Member</Badge>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Check-ins</CardTitle>
              <Calendar className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{todaysBookings}</div>
              <p className="text-xs text-gray-500 mt-1">Bookings for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <Clock className="w-5 h-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">{pendingBookings}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmed</CardTitle>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{confirmedBookings}</div>
              <p className="text-xs text-gray-500 mt-1">Active bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="bookings">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="services">
              <Building2 className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Manage Bookings</CardTitle>
                <CardDescription>View and update booking statuses</CardDescription>
                
                {/* Search and Filter */}
                <div className="flex gap-3 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, booking ID, or service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Update Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.customerName}</p>
                                <p className="text-xs text-gray-500">{booking.email}</p>
                                <p className="text-xs text-gray-500">{booking.phone}</p>
                              </div>
                            </TableCell>
                            <TableCell>{booking.service}</TableCell>
                            <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                            <TableCell>{booking.guests}</TableCell>
                            <TableCell className="font-semibold">₱{booking.totalAmount.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>
                              <Select
                                value={booking.status}
                                onValueChange={(value) => handleStatusChange(booking.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="grid gap-6">
              {/* Swimming Pools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="w-6 h-6 text-blue-600" />
                    Swimming Pools
                  </CardTitle>
                  <CardDescription>Current availability status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.filter((s) => s.type === 'swimming_pool').map((service) => (
                      <Card key={service.id} className={service.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <CardHeader>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>
                            Capacity: {service.capacity} guests
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="font-semibold text-blue-900">₱{service.pricePerDay.toLocaleString()}/day</p>
                            {service.entranceFeeAdult != null && service.entranceFeeChildSenior != null && (
                              <p className="text-xs text-gray-600">
                                Entrance: adults ₱{service.entranceFeeAdult}, kids (4–12) &amp; seniors ₱
                                {service.entranceFeeChildSenior}
                              </p>
                            )}
                            <div className="flex gap-2 flex-wrap">
                              {service.amenities.map((amenity, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                            <Badge className={service.available ? 'bg-green-600 hover:bg-green-600' : 'bg-red-600 hover:bg-red-600'}>
                              {service.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cottages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-6 h-6 text-green-600" />
                    Cottages
                  </CardTitle>
                  <CardDescription>Current availability status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.filter((s) => s.type === 'cottage').map((service) => (
                      <Card key={service.id} className={service.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <CardHeader>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>
                            Capacity: {service.capacity} guests
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="font-semibold text-blue-900">₱{service.pricePerDay.toLocaleString()}/day</p>
                            <div className="flex gap-2 flex-wrap">
                              {service.amenities.map((amenity, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                            <Badge className={service.available ? 'bg-green-600 hover:bg-green-600' : 'bg-red-600 hover:bg-red-600'}>
                              {service.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Hall */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-purple-600" />
                    Event Hall
                  </CardTitle>
                  <CardDescription>Current availability status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.filter((s) => s.type === 'event_hall').map((service) => (
                      <Card key={service.id} className={service.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <CardHeader>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>
                            Capacity: {service.capacity} guests
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="font-semibold text-blue-900">By pax (9am–9pm), from ₱{service.pricePerDay.toLocaleString()}</p>
                            {service.paxRates && service.paxRates.length > 0 && (
                              <ul className="text-xs text-gray-600 space-y-0.5">
                                {service.paxRates.map((t, idx) => (
                                  <li key={idx}>
                                    {t.maxPax >= 999 ? `${t.minPax}+ pax` : `${t.minPax}–${t.maxPax} pax`}: ₱
                                    {t.price.toLocaleString()}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {service.lightsAndSoundsFee != null && (
                              <p className="text-xs text-amber-800">+₱{service.lightsAndSoundsFee.toLocaleString()} client lights &amp; sounds</p>
                            )}
                            <div className="flex gap-2 flex-wrap">
                              {(service.inclusions ?? service.amenities).map((line, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs max-w-[240px] whitespace-normal text-left">
                                  {line}
                                </Badge>
                              ))}
                            </div>
                            <Badge className={service.available ? 'bg-green-600 hover:bg-green-600' : 'bg-red-600 hover:bg-red-600'}>
                              {service.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
