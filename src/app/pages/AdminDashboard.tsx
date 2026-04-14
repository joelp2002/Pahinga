import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Waves,
  LogOut,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Home,
  Building2,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { bookings, services, updateBookingStatus, deleteBooking, updateServiceAvailability } = useBooking();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
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

  const handleDeleteBooking = () => {
    if (bookingToDelete) {
      deleteBooking(bookingToDelete);
      toast.success('Booking deleted successfully');
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleServiceToggle = (serviceId: string, available: boolean) => {
    updateServiceAvailability(serviceId, available);
    toast.success(`Service ${available ? 'enabled' : 'disabled'}`);
  };

  // Statistics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // Chart data
  const statusData = [
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const revenueByService = Object.values(
    bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((acc, booking) => {
        if (!acc[booking.service]) {
          acc[booking.service] = { service: booking.service, revenue: 0 };
        }
        acc[booking.service].revenue += booking.totalAmount;
        return acc;
      }, {} as Record<string, { service: string; revenue: number }>)
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
              <h1 className="text-2xl font-bold text-blue-900">PAHINGA - Admin</h1>
              <p className="text-xs text-gray-600">Administrator Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <Badge variant="outline" className="text-xs">Administrator</Badge>
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
              <Calendar className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalBookings}</div>
              <p className="text-xs text-gray-500 mt-1">All time bookings</p>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">₱{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Confirmed + Completed</p>
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
              <Settings className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage and track all resort bookings</CardDescription>
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.customerName}</p>
                                <p className="text-xs text-gray-500">{booking.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{booking.service}</TableCell>
                            <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                            <TableCell>{booking.guests}</TableCell>
                            <TableCell className="font-semibold">₱{booking.totalAmount.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setBookingToDelete(booking.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
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
                  <CardDescription>Manage pool availability and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.filter(s => s.type === 'swimming_pool').map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{service.name}</h4>
                          <p className="text-sm text-gray-600">
                            Capacity: {service.capacity} guests | Listed rental ₱{service.pricePerDay.toLocaleString()}/day
                            {service.entranceFeeAdult != null && service.entranceFeeChildSenior != null && (
                              <> · Entrance adults ₱{service.entranceFeeAdult}, kids (4–12) &amp; seniors ₱{service.entranceFeeChildSenior}</>
                            )}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {service.amenities.map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{amenity}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`switch-${service.id}`} className="text-sm">
                            {service.available ? 'Available' : 'Unavailable'}
                          </Label>
                          <Switch
                            id={`switch-${service.id}`}
                            checked={service.available}
                            onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                          />
                        </div>
                      </div>
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
                  <CardDescription>Manage cottage availability and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.filter(s => s.type === 'cottage').map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{service.name}</h4>
                          <p className="text-sm text-gray-600">Capacity: {service.capacity} guests | ₱{service.pricePerDay.toLocaleString()}/day</p>
                          <div className="flex gap-2 mt-2">
                            {service.amenities.map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{amenity}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`switch-${service.id}`} className="text-sm">
                            {service.available ? 'Available' : 'Unavailable'}
                          </Label>
                          <Switch
                            id={`switch-${service.id}`}
                            checked={service.available}
                            onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                          />
                        </div>
                      </div>
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
                  <CardDescription>Manage event hall availability and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.filter(s => s.type === 'event_hall').map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{service.name}</h4>
                          <p className="text-sm text-gray-600">
                            Capacity: up to {service.capacity} guests | Venue package 9am–9pm, priced by headcount (from ₱
                            {service.pricePerDay.toLocaleString()} for 30–40 pax)
                          </p>
                          {service.paxRates && service.paxRates.length > 0 && (
                            <ul className="text-xs text-gray-600 mt-2 space-y-0.5 font-mono">
                              {service.paxRates.map((t, idx) => (
                                <li key={idx}>
                                  {t.maxPax >= 999 ? `${t.minPax}+ pax` : `${t.minPax}–${t.maxPax} pax`}: ₱
                                  {t.price.toLocaleString()}
                                </li>
                              ))}
                            </ul>
                          )}
                          {service.lightsAndSoundsFee != null && (
                            <p className="text-xs text-amber-800 mt-1">
                              +₱{service.lightsAndSoundsFee.toLocaleString()} lights &amp; sounds (client-supplied)
                            </p>
                          )}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {(service.inclusions ?? service.amenities).slice(0, 6).map((line, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs max-w-[280px] whitespace-normal text-left">
                                {line}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`switch-${service.id}`} className="text-sm">
                            {service.available ? 'Available' : 'Unavailable'}
                          </Label>
                          <Switch
                            id={`switch-${service.id}`}
                            checked={service.available}
                            onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Status Distribution</CardTitle>
                  <CardDescription>Overview of all booking statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Service</CardTitle>
                  <CardDescription>Income breakdown per service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueByService}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="service" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0088FE" name="Revenue (₱)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Service Utilization</CardTitle>
                  <CardDescription>Most popular services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      bookings.reduce((acc, booking) => {
                        acc[booking.service] = (acc[booking.service] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort(([, a], [, b]) => b - a)
                      .map(([service, count]) => (
                        <div key={service} className="flex items-center justify-between">
                          <span className="font-medium">{service}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600"
                                style={{ width: `${(count / bookings.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-16 text-right">{count} bookings</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
