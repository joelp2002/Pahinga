import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Users, Waves, Home, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { EVENT_HALL_INCLUSIONS, EVENT_HALL_PAX_RATES, RESORT_HOURS_NOTE } from '../lib/resortRates';

type ResortImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function ResortImage({ src, alt, className = '' }: ResortImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}>
        <div className="text-center px-4">
          <div className="text-5xl mb-2">🖼️</div>
          <p className="font-medium">Image not found</p>
          <p className="text-xs mt-1 break-all">{src}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Waves className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">PAHINGA</h1>
              <p className="text-xs text-gray-600">AML&apos;s Resort Management System</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/booking')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>

            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="lg"
            >
              Staff Login
            </Button>
          </div>
        </div>
      </header>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ResortImage
            src="/images/cottage-exterior.jpg"
            alt="AML's Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/50" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">Welcome to AML&apos;s Resort</h2>
          <p className="text-xl md:text-2xl mb-2">Poras, Boac, Marinduque</p>
          <p className="text-lg mb-8 text-blue-100">
            Experience paradise with world-class facilities and services
          </p>

          <Button
            onClick={() => navigate('/booking')}
            size="lg"
            className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6"
          >
            Reserve Your Spot Today
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-blue-900 mb-4">Our Services</h3>
          <p className="text-xl text-gray-600">Everything you need for a perfect getaway</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-64 overflow-hidden">
              <ResortImage
                src="/images/pool-ground.jpg"
                alt="Swimming Pool"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Waves className="w-6 h-6" />
                Swimming Pools
              </CardTitle>
              <CardDescription>Crystal clear waters for all ages</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-gray-700 mb-4">
                Enjoy our main pool and dedicated kids pool with safety features and comfortable facilities.
              </p>

              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Lifeguard on duty</li>
                <li>✓ Shower and changing rooms</li>
                <li>✓ Entrance: adults ₱125</li>
                <li>✓ Kids (4–12) &amp; seniors ₱100</li>
                <li>✓ {RESORT_HOURS_NOTE}</li>
              </ul>

              <p className="mt-4 text-sm text-gray-600">
                Pool day packages for groups also available via booking.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-64 overflow-hidden">
              <ResortImage
                src="/images/cottage-exterior.jpg"
                alt="Cottages"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Home className="w-6 h-6" />
                Family Cottages
              </CardTitle>
              <CardDescription>Comfortable spaces for your group</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-gray-700 mb-4">
                Spacious cottages perfect for families and friends, equipped with all essentials.
              </p>

              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Cabana — ₱400/day</li>
                <li>✓ Gazebo — ₱450/day</li>
                <li>✓ Big Cabana — ₱700/day</li>
                <li>✓ {RESORT_HOURS_NOTE}</li>
              </ul>

              <p className="mt-4 text-lg font-bold text-blue-900">From ₱400/day</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-64 overflow-hidden">
              <ResortImage
                src="/images/event-hall.jpg"
                alt="Event Hall"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Building2 className="w-6 h-6" />
                Event Hall
              </CardTitle>
              <CardDescription>Perfect venue for celebrations</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-gray-700 mb-4">
                Grand event hall packages by headcount (venue 9am–9pm). Shared pool access for your guests; pool is not private.
              </p>

              <ul className="space-y-2 text-sm text-gray-600">
                {EVENT_HALL_INCLUSIONS.map((line) => (
                  <li key={line}>✓ {line}</li>
                ))}
                <li>✓ Additional ₱1,000 if you bring lights &amp; sounds</li>
                <li>✓ {RESORT_HOURS_NOTE}</li>
              </ul>

              <div className="mt-4 text-sm text-gray-700">
                <p className="font-semibold text-blue-900 mb-2">Rates by pax</p>
                <ul className="space-y-1 font-mono text-xs">
                  {EVENT_HALL_PAX_RATES.map((t) => (
                    <li key={`${t.minPax}-${t.maxPax}`}>
                      {t.maxPax >= 999
                        ? `${t.minPax}+ pax`
                        : `${t.minPax}–${t.maxPax} pax`}: ₱{t.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-blue-900 mb-4">Why Choose PAHINGA System?</h3>
            <p className="text-xl text-gray-600">Integrated, Automated, Efficient</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Easy Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reserve your preferred dates and services online with our automated system
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Real-time Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Check service availability instantly and avoid double bookings
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Integrated Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Unified system for all resort operations and services
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Waves className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>24/7 Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Book anytime, anywhere with our online reservation system
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-blue-900 mb-4">Contact Us</h3>
          <p className="text-xl text-gray-600">Get in touch for inquiries and reservations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Poras, Boac</p>
              <p className="text-gray-700">Marinduque, Philippines</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">+63 917 123 4567</p>
              <p className="text-gray-700">+63 918 234 5678</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">info@amlsresort.com</p>
              <p className="text-gray-700">bookings@amlsresort.com</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves className="w-6 h-6" />
            <h3 className="text-xl font-bold">PAHINGA - AML&apos;s Resort</h3>
          </div>
          <p className="text-blue-200 mb-4">Integrated Management System for Resort Operations</p>
          <p className="text-sm text-blue-300">© 2026 AML&apos;s Resort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};