# PAHINGA - Integrated Resort Management System
## AML's Resort, Poras, Boac, Marinduque

---

## 📋 System Overview

PAHINGA is a comprehensive, integrated management system designed specifically for AML's Resort. The system provides automated booking, real-time availability tracking, and complete management dashboards for resort operations.

## 🎯 Key Features

### 1. **Customer Booking System**
- Multi-step booking form with intuitive UI
- Real-time service availability checking
- Automated booking conflict prevention
- Instant booking confirmation
- Support for:
  - Swimming pools
  - Family cottages
  - Event hall reservations

### 2. **Admin Dashboard**
- Complete booking management (CRUD operations)
- Service availability control
- Revenue analytics and reporting
- Booking status distribution charts
- Service utilization metrics
- Real-time statistics

### 3. **Employee Dashboard**
- View and manage bookings
- Update booking statuses
- Service availability monitoring
- Search and filter capabilities
- Today's check-in tracking

### 4. **Integrated Features**
- Automated availability tracking
- Date conflict prevention
- Multi-service booking support
- Real-time updates across all modules
- Responsive design for all devices

---

## 🏗️ System Architecture

### Technology Stack
- **Frontend Framework**: React 18.3.1
- **Routing**: React Router 7.13.0
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI + Custom Components
- **Charts**: Recharts 2.15.2
- **State Management**: React Context API
- **Notifications**: Sonner (Toast notifications)

### Project Structure
```
/src/app/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── StatsCard.tsx   # Statistics card component
├── context/            # State management
│   ├── AuthContext.tsx
│   └── BookingContext.tsx
├── data/               # Mock data and types
│   └── mockData.ts
├── pages/              # Main application pages
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── BookingForm.tsx
│   ├── AdminDashboard.tsx
│   └── EmployeeDashboard.tsx
├── routes.tsx          # Application routing
└── App.tsx            # Root component
```

---

## 👥 User Roles & Access

### 1. **Customer/Guest**
- Access: Public booking form
- Features:
  - Browse available services
  - Check real-time availability
  - Submit booking requests
  - Receive booking confirmation

### 2. **Employee/Staff**
- Login: `username: employee | password: employee123`
- Features:
  - View all bookings
  - Update booking statuses
  - Check service availability
  - Search and filter bookings
  - Monitor today's check-ins

### 3. **Administrator**
- Login: `username: admin | password: admin123`
- Features:
  - Full booking management (create, read, update, delete)
  - Service availability control
  - Analytics and reporting
  - Revenue tracking
  - Complete system oversight

---

## 📊 Available Services

### Swimming Pools
1. **Main Swimming Pool**
   - Capacity: 50 guests
   - Price: ₱3,500/day
   - Amenities: Lifeguard, Pool Toys, Shower Facilities, Changing Rooms

2. **Kids Swimming Pool**
   - Capacity: 20 guests
   - Price: ₱2,000/day
   - Amenities: Shallow Water, Water Slides, Safety Floats

### Cottages
1. **Family Cottage A & B**
   - Capacity: 8 guests each
   - Price: ₱4,500/day
   - Amenities: Tables & Chairs, Electric Outlet, Grill Area, Refrigerator

2. **Premium Cottage**
   - Capacity: 12 guests
   - Price: ₱6,000/day
   - Amenities: Tables & Chairs, Electric Outlet, Grill Area, Refrigerator, Sound System

3. **Standard Cottage C & D**
   - Capacity: 6 guests each
   - Price: ₱3,500/day
   - Amenities: Tables & Chairs, Electric Outlet

### Event Hall
1. **Grand Event Hall**
   - Capacity: 150 guests
   - Price: ₱15,000/day
   - Amenities: Air Conditioning, Sound System, Stage, Tables & Chairs, Kitchen Access, Parking Space

---

## 🔄 Booking Workflow

### Customer Flow:
1. Browse landing page and services
2. Click "Book Now"
3. Select service type and dates
4. View available services (filtered by capacity and date conflicts)
5. Enter personal information
6. Review booking details
7. Submit booking
8. Receive confirmation with booking reference

### Staff Processing:
1. Login to employee/admin dashboard
2. View pending bookings
3. Verify booking details
4. Update status to "Confirmed"
5. Customer receives confirmation
6. On completion, update status to "Completed"

---

## 📈 Analytics & Reporting

The admin dashboard provides:
- **Total bookings count**
- **Pending requests tracker**
- **Confirmed bookings count**
- **Total revenue calculation**
- **Booking status distribution (Pie Chart)**
- **Revenue by service type (Bar Chart)**
- **Service utilization metrics**

---

## 🔐 Security Features

- Role-based access control
- Protected routes for admin/employee dashboards
- Session management via Context API
- Input validation on all forms
- Status-based access restrictions

---

## 🚀 Getting Started

### For Customers:
1. Visit the landing page
2. Explore available services
3. Click "Book Now" to make a reservation
4. Fill out the booking form
5. Receive booking confirmation

### For Staff:
1. Navigate to "Staff Login"
2. Enter credentials
3. Access appropriate dashboard based on role
4. Manage bookings and services

---

## 📱 Responsive Design

The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern web browsers

---

## 🔧 System Features

### Automated Functions:
- ✅ Real-time availability checking
- ✅ Automatic date conflict detection
- ✅ Dynamic pricing calculation
- ✅ Booking reference generation
- ✅ Status workflow management
- ✅ Service capacity validation

### Data Management:
- ✅ Persistent state management
- ✅ Real-time updates
- ✅ CRUD operations for bookings
- ✅ Service availability toggling
- ✅ Search and filter capabilities

---

## 📞 Contact Information

**AML's Resort**
- Location: Poras, Boac, Marinduque, Philippines
- Phone: +63 917 123 4567 / +63 918 234 5678
- Email: info@amlsresort.com / bookings@amlsresort.com

---

## 🎨 Design System

The system uses a cohesive blue-themed design:
- Primary Color: Blue (#0088FE)
- Status Colors:
  - Pending: Yellow
  - Confirmed: Green
  - Completed: Blue
  - Cancelled: Red

---

## 📝 Notes

This is a prototype/demonstration system with mock data. For production deployment:
- Implement backend API integration
- Add database connectivity
- Implement secure authentication
- Add payment gateway integration
- Include email notification system
- Add SMS confirmation feature
- Implement data backup systems
- Add advanced analytics

---

**System Version**: 1.0.0  
**Last Updated**: February 28, 2026  
**Developed for**: AML's Resort, Marinduque
