import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useBooking } from '../context/BookingContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Waves, ArrowLeft, Calendar, Users, DollarSign, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Service } from '../data/mockData';
import { getBookingSubtotal, eventHallTierPrice } from '../lib/servicePricing';

export function BookingForm() {
  const navigate = useNavigate();
  const { addBooking, fetchAvailableServices } = useBooking();
  
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<string>('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(1);
  
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (checkIn && checkOut && serviceType) {
      fetchAvailableServices(checkIn, checkOut, serviceType)
        .then((services) => {
          setAvailableServices(services);
          setSelectedService(null);
        })
        .catch(() => {
          setAvailableServices([]);
          setSelectedService(null);
        });
    }
  }, [checkIn, checkOut, serviceType, fetchAvailableServices]);

  useEffect(() => {
    if (serviceType === 'event_hall' && guests < 30) {
      setGuests(30);
    }
  }, [serviceType, guests]);

  const calculateTotal = () => {
    if (!selectedService || !checkIn || !checkOut) return 0;
    return getBookingSubtotal(selectedService, guests, checkIn, checkOut);
  };

  const handleServiceSelection = (serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    setSelectedService(service || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      toast.error('Please select a service');
      return;
    }

    const newBooking = {
      customerName,
      email,
      phone,
      service: selectedService.name,
      checkIn,
      checkOut,
      guests,
      status: 'pending' as const,
      totalAmount: calculateTotal(),
    };

    try {
      const createdBooking = await addBooking(newBooking);
      setBookingId(createdBooking.id);
      setBookingComplete(true);
      toast.success('Booking submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <Waves className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">PAHINGA</h1>
              <p className="text-xs text-gray-600">Booking System</p>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-6 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl text-green-900">Booking Confirmed!</CardTitle>
              <CardDescription className="text-lg">Your reservation has been submitted successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
                <p className="text-3xl font-bold text-blue-900">{bookingId}</p>
              </div>

              <div className="text-left space-y-3 border-t pt-6">
                <h3 className="font-semibold text-lg text-blue-900">Booking Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Service</p>
                    <p className="font-semibold">{selectedService?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Guest Name</p>
                    <p className="font-semibold">{customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="font-semibold">{new Date(checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-out</p>
                    <p className="font-semibold">{new Date(checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Number of Guests</p>
                    <p className="font-semibold">{guests}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-semibold text-blue-900">₱{calculateTotal().toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-left">
                <p className="text-sm text-yellow-900">
                  <strong>Note:</strong> Your booking is pending confirmation. Our staff will contact you within 24 hours to confirm your reservation and provide payment details.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => window.print()} variant="outline" className="flex-1">
                  Print Receipt
                </Button>
                <Button onClick={() => navigate('/')} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Waves className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">PAHINGA</h1>
              <p className="text-xs text-gray-600">Booking System</p>
            </div>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <p className="text-sm font-semibold">Select Service</p>
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <p className="text-sm font-semibold">Your Information</p>
            </div>
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex-1 text-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <p className="text-sm font-semibold">Confirm</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Service & Dates</CardTitle>
                <CardDescription>Choose your preferred service and booking dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select value={serviceType} onValueChange={setServiceType} required>
                      <SelectTrigger id="serviceType">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="swimming_pool">Swimming Pool</SelectItem>
                        <SelectItem value="cottage">Cottage</SelectItem>
                        <SelectItem value="event_hall">Event Hall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min={serviceType === 'event_hall' ? 30 : 1}
                      value={guests}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setGuests(Number.isNaN(v) ? 1 : v);
                      }}
                      required
                    />
                    {serviceType === 'event_hall' && (
                      <p className="text-xs text-gray-600">Event hall rates apply from 30 pax upward.</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {availableServices.length > 0 && (
                  <div className="space-y-2">
                    <Label>Available Services</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {availableServices.map((service) => (
                        <Card
                          key={service.id}
                          className={`cursor-pointer transition-all ${
                            selectedService?.id === service.id
                              ? 'ring-2 ring-blue-600 bg-blue-50'
                              : 'hover:shadow-lg'
                          }`}
                          onClick={() => handleServiceSelection(service.id)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription>
                              Capacity: {service.capacity} guests
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {service.type === 'event_hall' && service.paxRates?.length ? (
                              <>
                                <p className="font-bold text-blue-900 text-lg mb-1">By headcount (9am–9pm)</p>
                                <p className="text-sm text-gray-700 mb-2">
                                  Your {guests} pax:{' '}
                                  <span className="font-semibold text-blue-900">
                                    ₱{eventHallTierPrice(guests, service.paxRates).toLocaleString()}
                                  </span>
                                  /day
                                </p>
                                <ul className="text-xs text-gray-600 space-y-0.5 mb-2 max-h-24 overflow-y-auto border rounded p-2 bg-white/80">
                                  {service.paxRates.map((t, idx) => (
                                    <li key={idx}>
                                      {t.minPax === t.maxPax
                                        ? `${t.minPax} pax`
                                        : t.maxPax >= 999
                                          ? `${t.minPax}+ pax`
                                          : `${t.minPax}–${t.maxPax} pax`}
                                      : ₱{t.price.toLocaleString()}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <p className="font-bold text-blue-900 text-xl mb-2">
                                ₱{service.pricePerDay.toLocaleString()}/day
                              </p>
                            )}
                            <div className="space-y-1 text-sm text-gray-600">
                              {(service.inclusions ?? service.amenities).slice(0, 4).map((line, idx) => (
                                <p key={idx}>✓ {line}</p>
                              ))}
                            </div>
                            {service.type === 'event_hall' && service.lightsAndSoundsFee != null && (
                              <p className="text-xs text-amber-800 mt-2">
                                +₱{service.lightsAndSoundsFee.toLocaleString()} if you bring lights &amp; sounds.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {serviceType && checkIn && checkOut && availableServices.length === 0 && (
                  <div className="text-center py-8 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-900">No services available for the selected dates. Please try different dates.</p>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!selectedService}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Your Information
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Customer Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Please provide your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0917-123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Confirm Your Booking</CardTitle>
                <CardDescription>Please review your booking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Service</p>
                    <p className="font-semibold text-lg">{selectedService?.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Check-in
                      </p>
                      <p className="font-semibold">{new Date(checkIn).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Check-out
                      </p>
                      <p className="font-semibold">{new Date(checkOut).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of Guests
                    </p>
                    <p className="font-semibold">{guests} guests</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {customerName}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Total Amount
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        ₱{calculateTotal().toLocaleString()}
                      </p>
                      {selectedService?.type === 'event_hall' && selectedService.lightsAndSoundsFee != null && (
                        <p className="text-xs text-amber-900 mt-2 max-w-md">
                          Venue total above is for the hall package only. Add ₱
                          {selectedService.lightsAndSoundsFee.toLocaleString()} if you bring your own lights and sounds
                          (charged separately).
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
