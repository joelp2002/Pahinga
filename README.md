# PAHINGA - AML's Resort Management System

An integrated, automated management system for AML's Resort in Poras, Boac, Marinduque.

## 🚀 Quick Start

### Demo Credentials

**Administrator Access:**
- Username: `admin`
- Password: `admin123`

**Employee Access:**
- Username: `employee`
- Password: `employee123`

**Customer Access:**
- No login required - use the "Book Now" button on the homepage

## 📱 Features

### Customer Portal
- Browse resort services (Swimming pools, Cottages, Event hall)
- Real-time availability checking
- Multi-step booking form
- Instant booking confirmation
- Automated conflict prevention

### Employee Dashboard
- View and manage all bookings
- Update booking statuses
- Check service availability
- Search and filter bookings
- Monitor today's check-ins

### Admin Dashboard
- Complete booking management (CRUD)
- Service availability control
- Analytics and charts
- Revenue tracking
- Service utilization metrics

## 🏗️ System Modules

1. **Booking/Reservation Module**
   - Multi-step form with validation
   - Date range selection
   - Service selection with real-time availability
   - Guest information collection
   - Booking confirmation

2. **Availability Management Module**
   - Automated conflict detection
   - Real-time service status
   - Capacity management
   - Date-based filtering

3. **Admin Dashboard Module**
   - Statistics overview
   - Booking management table
   - Service control panel
   - Analytics charts (Pie, Bar)
   - CRUD operations

4. **Employee Dashboard Module**
   - Simplified booking management
   - Status update capabilities
   - Service viewing
   - Search functionality

## 🎯 Available Services

### Swimming Pools
- Main Swimming Pool (50 guests) - ₱3,500/day
- Kids Swimming Pool (20 guests) - ₱2,000/day

### Cottages
- Family Cottages A & B (8 guests) - ₱4,500/day
- Premium Cottage (12 guests) - ₱6,000/day
- Standard Cottages C & D (6 guests) - ₱3,500/day

### Event Hall
- Grand Event Hall (150 guests) - ₱15,000/day

## 💻 Technical Stack

- **React** 18.3.1
- **React Router** 7.13.0
- **Tailwind CSS** 4.1.12
- **Recharts** (Analytics)
- **Radix UI** (Components)
- **TypeScript** (Type safety)

## 📁 Project Structure

```
/src/app/
├── components/         # Reusable components
├── context/           # State management (Auth, Booking)
├── data/              # Mock data and types
├── pages/             # Main application pages
├── routes.tsx         # Application routing
└── App.tsx           # Root component
```

## 🔄 Booking Status Flow

1. **Pending** - Initial status after customer submission
2. **Confirmed** - Approved by staff
3. **Completed** - Service rendered
4. **Cancelled** - Booking cancelled

## 🎨 Color Scheme

- Primary: Blue (#0088FE)
- Pending: Yellow
- Confirmed: Green
- Completed: Blue
- Cancelled: Red

## 📊 Data Management

All data is currently stored in-memory using React Context API. The system includes:
- Booking state management
- Service availability tracking
- User authentication
- Real-time updates

## 🔐 Security

- Role-based access control
- Protected routes
- Session management
- Input validation

## 📝 Notes

This is a prototype system with mock data for demonstration purposes. For production use, consider:
- Backend API integration
- Database implementation
- Payment gateway
- Email/SMS notifications
- Enhanced security measures

## 📞 Contact

AML's Resort
- Location: Poras, Boac, Marinduque, Philippines
- Phone: +63 917 123 4567
- Email: bookings@amlsresort.com

---

**Version:** 1.0.0  
**Last Updated:** February 28, 2026
