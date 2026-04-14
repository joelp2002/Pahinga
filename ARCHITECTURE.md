# PAHINGA Resort Management System - Architecture Documentation

## Technology Stack

### Frontend
- **React.js 18.3.1** - Modern UI library for building interactive user interfaces
- **React Router 7.13.0** - Client-side routing for multi-page navigation
- **Tailwind CSS 4.1.12** - Utility-first CSS framework for styling
- **Recharts 2.15.2** - Chart library for analytics visualization
- **Radix UI** - Accessible component primitives
- **Context API** - State management across the application

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for RESTful APIs
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **bcrypt** - Password hashing for security

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- Collections: Users, Bookings, Pools, Cottages, EventHalls, Analytics

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │              REACT.JS FRONTEND APPLICATION                     │ │
│  │                                                                │ │
│  │  Components:                                                   │ │
│  │  • Landing Page          • Login/Auth                         │ │
│  │  • Booking Form          • Admin Dashboard                    │ │
│  │  • Employee Dashboard    • Customer Interface                 │ │
│  │                                                                │ │
│  │  State Management:                                             │ │
│  │  • AuthContext (User sessions, roles, permissions)            │ │
│  │  • BookingContext (Bookings, availability, real-time updates) │ │
│  │                                                                │ │
│  │  Routing:                                                      │ │
│  │  • React Router (SPA navigation, protected routes)            │ │
│  └───────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS Requests
                             │ (REST API Calls)
                             │ • JSON Payloads
                             │ • JWT Auth Headers
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                      INTERNET / CLOUD                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                  NODE.JS + EXPRESS.JS BACKEND                       │
│                      (API Server)                                   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    MIDDLEWARE LAYER                            │ │
│  │  • CORS Handler          • Body Parser                        │ │
│  │  • JWT Authenticator     • Error Handler                      │ │
│  │  • Rate Limiter          • Request Logger                     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                      API ENDPOINTS                             │ │
│  │                                                                │ │
│  │  Authentication Routes:                                        │ │
│  │  • POST /api/auth/register - User registration                │ │
│  │  • POST /api/auth/login - User login (JWT generation)         │ │
│  │  • POST /api/auth/logout - Session termination                │ │
│  │  • GET /api/auth/me - Get current user                        │ │
│  │                                                                │ │
│  │  Booking Routes:                                               │ │
│  │  • POST /api/bookings - Create new booking                    │ │
│  │  • GET /api/bookings - Get all bookings (filtered by role)    │ │
│  │  • GET /api/bookings/:id - Get specific booking               │ │
│  │  • PUT /api/bookings/:id - Update booking                     │ │
│  │  • DELETE /api/bookings/:id - Delete booking (admin only)     │ │
│  │  • GET /api/bookings/check-availability - Check availability  │ │
│  │                                                                │ │
│  │  Resource Routes:                                              │ │
│  │  • GET /api/pools - Get all swimming pools                    │ │
│  │  • GET /api/cottages - Get all cottages                       │ │
│  │  • GET /api/event-halls - Get all event halls                 │ │
│  │  • PUT /api/pools/:id - Update pool (admin only)              │ │
│  │  • PUT /api/cottages/:id - Update cottage (admin only)        │ │
│  │  • PUT /api/event-halls/:id - Update event hall (admin only)  │ │
│  │                                                                │ │
│  │  Analytics Routes:                                             │ │
│  │  • GET /api/analytics/dashboard - Get dashboard metrics       │ │
│  │  • GET /api/analytics/revenue - Revenue reports               │ │
│  │  • GET /api/analytics/occupancy - Occupancy statistics        │ │
│  │  • GET /api/analytics/trends - Booking trends                 │ │
│  │                                                                │ │
│  │  User Management Routes (Admin):                               │ │
│  │  • GET /api/users - Get all users                             │ │
│  │  • PUT /api/users/:id - Update user                           │ │
│  │  • DELETE /api/users/:id - Delete user                        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    BUSINESS LOGIC LAYER                        │ │
│  │  • Booking validation        • Availability checking          │ │
│  │  • Conflict detection        • Price calculation              │ │
│  │  • Role-based access control • Data sanitization              │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    DATA ACCESS LAYER                           │ │
│  │  • Mongoose Models           • Schema Validation              │ │
│  │  • Database Queries          • Aggregation Pipelines          │ │
│  └───────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ MongoDB Driver
                             │ (Mongoose ODM)
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                     MONGODB ATLAS (CLOUD)                           │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    DATABASE COLLECTIONS                        │ │
│  │                                                                │ │
│  │  users Collection:                                             │ │
│  │  {                                                             │ │
│  │    _id: ObjectId,                                              │ │
│  │    name: String,                                               │ │
│  │    email: String (unique, indexed),                            │ │
│  │    password: String (hashed with bcrypt),                      │ │
│  │    role: String (admin/employee/customer),                     │ │
│  │    createdAt: Date,                                            │ │
│  │    updatedAt: Date                                             │ │
│  │  }                                                             │ │
│  │                                                                │ │
│  │  bookings Collection:                                          │ │
│  │  {                                                             │ │
│  │    _id: ObjectId,                                              │ │
│  │    userId: ObjectId (ref: users),                              │ │
│  │    customerName: String,                                       │ │
│  │    email: String,                                              │ │
│  │    phone: String,                                              │ │
│  │    bookingType: String (pool/cottage/event-hall),              │ │
│  │    resourceId: ObjectId,                                       │ │
│  │    checkInDate: Date (indexed),                                │ │
│  │    checkOutDate: Date (indexed),                               │ │
│  │    numberOfGuests: Number,                                     │ │
│  │    totalPrice: Number,                                         │ │
│  │    status: String (pending/confirmed/cancelled),               │ │
│  │    specialRequests: String,                                    │ │
│  │    createdAt: Date,                                            │ │
│  │    updatedAt: Date                                             │ │
│  │  }                                                             │ │
│  │  Indexes: [checkInDate, checkOutDate, status, userId]         │ │
│  │                                                                │ │
│  │  pools Collection:                                             │ │
│  │  {                                                             │ │
│  │    _id: ObjectId,                                              │ │
│  │    name: String,                                               │ │
│  │    capacity: Number,                                           │ │
│  │    pricePerDay: Number,                                        │ │
│  │    features: [String],                                         │ │
│  │    status: String (available/maintenance),                     │ │
│  │    imageUrl: String                                            │ │
│  │  }                                                             │ │
│  │                                                                │ │
│  │  cottages Collection:                                          │ │
│  │  {                                                             │ │
│  │    _id: ObjectId,                                              │ │
│  │    name: String,                                               │ │
│  │    capacity: Number,                                           │ │
│  │    pricePerNight: Number,                                      │ │
│  │    amenities: [String],                                        │ │
│  │    status: String (available/occupied/maintenance),            │ │
│  │    imageUrl: String                                            │ │
│  │  }                                                             │ │
│  │                                                                │ │
│  │  eventHalls Collection:                                        │ │
│  │  {                                                             │ │
│  │    _id: ObjectId,                                              │ │
│  │    name: String,                                               │ │
│  │    capacity: Number,                                           │ │
│  │    pricePerHour: Number,                                       │ │
│  │    facilities: [String],                                       │ │
│  │    status: String (available/booked/maintenance),              │ │
│  │    imageUrl: String                                            │ │
│  │  }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Features:                                                          │
│  • Replica Sets (High Availability)                                │
│  • Automatic Backups                                               │
│  • Point-in-Time Recovery                                          │
│  • Performance Monitoring                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow & Communication

### 1. User Authentication Flow

```
┌─────────┐      1. POST /api/auth/login       ┌─────────┐
│ React   │────────(email, password)──────────>│ Express │
│ Frontend│                                     │ Backend │
│         │                                     │         │
│         │      2. Query user by email        │         │
│         │           ┌─────────────────────────┴───┐     │
│         │           │                             │     │
│         │           ▼                             │     │
│         │      ┌─────────┐                        │     │
│         │      │ MongoDB │                        │     │
│         │      │  Atlas  │ Return user document   │     │
│         │      └─────────┘                        │     │
│         │           │                             │     │
│         │           └─────────────────────────────┘     │
│         │                                               │
│         │      3. Verify password (bcrypt)              │
│         │      4. Generate JWT token                    │
│         │                                               │
│         │<────5. Return { token, user data }────────────│
│         │                                               │
│         │      6. Store token in localStorage           │
│         │      7. Update AuthContext                    │
│         │      8. Redirect to dashboard                 │
└─────────┘                                       └─────────┘
```

### 2. Booking Creation Flow

```
┌─────────┐   1. Fill booking form    ┌─────────┐
│ Customer│──────────────────────────>│ React   │
│         │                            │ Form    │
└─────────┘                            └────┬────┘
                                            │
                 2. Submit booking data     │
                 POST /api/bookings         │
                 Headers: { Authorization:  │
                           Bearer <token> } │
                                            │
                                            ▼
                                   ┌─────────────┐
                                   │   Express   │
                                   │   Backend   │
                                   └──────┬──────┘
                                          │
                 3. Verify JWT token      │
                 4. Extract user info     │
                                          │
                 5. Check availability    │
                    (Query overlapping    │
                     bookings)            │
                          │               │
                          ▼               │
                    ┌──────────┐          │
                    │ MongoDB  │          │
                    │  Atlas   │          │
                    └──────────┘          │
                          │               │
                 6. No conflicts found    │
                          │               │
                          ▼               │
                 7. Calculate total price │
                 8. Create booking doc    │
                 9. Save to DB            │
                          │               │
                          ▼               │
                    ┌──────────┐          │
                    │ MongoDB  │          │
                    │  Atlas   │          │
                    └──────────┘          │
                          │               │
                10. Return booking data   │
                          │               │
                          ▼               │
                   ┌─────────────┐        │
                   │   React     │<───────┘
                   │  Frontend   │
                   └──────┬──────┘
                          │
                11. Update BookingContext
                12. Show confirmation
                13. Navigate to success page
```

### 3. Admin Dashboard Analytics Flow

```
┌──────────┐  1. Load dashboard     ┌─────────┐
│  Admin   │───────────────────────>│ React   │
│Dashboard │                         │Component│
└──────────┘                         └────┬────┘
                                          │
              2. GET /api/analytics/dashboard
                 Headers: { Authorization:
                           Bearer <token> }
                                          │
                                          ▼
                                 ┌─────────────┐
                                 │   Express   │
                                 │   Backend   │
                                 └──────┬──────┘
                                        │
              3. Verify JWT & admin role
                                        │
              4. Run aggregation queries:
                 • Total revenue
                 • Booking counts
                 • Occupancy rates
                 • Recent transactions
                                        │
                                        ▼
                                  ┌──────────┐
                                  │ MongoDB  │
                                  │  Atlas   │
                                  └──────────┘
                                        │
                                  Aggregation
                                   Pipeline:
                  - $match (date filters)
                  - $group (sum, count, avg)
                  - $lookup (join collections)
                  - $project (shape data)
                                        │
                                        ▼
              5. Return analytics JSON
                 { revenue: 50000,
                   bookings: 125,
                   trends: [...],
                   charts: [...] }
                                        │
                                        ▼
                                 ┌─────────┐
                                 │  React  │
                                 │Dashboard│
                                 └────┬────┘
                                      │
              6. Render Recharts components
              7. Display metrics cards
              8. Update in real-time
```

### 4. Availability Checking Flow

```
┌─────────┐  1. Select dates       ┌─────────┐
│Customer │───────────────────────>│ Booking │
│         │                         │  Form   │
└─────────┘                         └────┬────┘
                                         │
           2. onChange event triggers    │
              availability check          │
                                         │
           3. GET /api/bookings/        │
              check-availability?        │
              resourceType=pool&         │
              checkIn=2026-04-10&        │
              checkOut=2026-04-12        │
                                         │
                                         ▼
                                ┌─────────────┐
                                │   Express   │
                                │   Backend   │
                                └──────┬──────┘
                                       │
           4. Query overlapping bookings:
              {                        │
                resourceType: 'pool',  │
                $or: [                 │
                  { checkInDate:       │
                    { $lte: checkOut,  │
                      $gte: checkIn }},│
                  { checkOutDate:      │
                    { $gte: checkIn,   │
                      $lte: checkOut }}│
                ],                     │
                status: { $ne:         │
                  'cancelled' }        │
              }                        │
                                       ▼
                                 ┌──────────┐
                                 │ MongoDB  │
                                 │  Atlas   │
                                 └──────────┘
                                       │
           5. Calculate available     │
              resources               │
                                       │
           6. Return availability:    │
              { available: true,      │
                resources: [...],     │
                message: "5 pools     │
                         available" } │
                                       │
                                       ▼
                                 ┌─────────┐
                                 │ Booking │
                                 │  Form   │
                                 └────┬────┘
                                      │
           7. Update UI with available
              options
           8. Enable/disable booking
              button
```

---

## Security Measures

### Authentication & Authorization

1. **JWT-Based Authentication**
   - Tokens issued on successful login
   - Stored in localStorage (frontend)
   - Sent in Authorization header for each request
   - Verified by middleware on backend

2. **Password Security**
   - Hashed using bcrypt (salt rounds: 10)
   - Never stored or transmitted in plain text
   - Validation on both client and server

3. **Role-Based Access Control (RBAC)**
   ```javascript
   Roles:
   - Admin: Full CRUD access to all resources
   - Employee: Read bookings, update status
   - Customer: Create bookings, view own bookings
   ```

4. **Middleware Protection**
   ```javascript
   • authenticateToken - Validates JWT
   • authorizeRoles([...]) - Checks user role
   • validateInput - Sanitizes request data
   ```

### API Security

1. **CORS (Cross-Origin Resource Sharing)**
   - Configured to allow frontend domain only
   - Credentials included for cookie support

2. **Rate Limiting**
   - Prevents brute force attacks
   - Limits requests per IP address

3. **Input Validation**
   - All inputs sanitized and validated
   - Mongoose schema validation
   - XSS prevention

4. **Environment Variables**
   - Sensitive data in .env files
   - Never committed to version control
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

---

## Database Design

### Collections & Relationships

```
users (One-to-Many) ──────► bookings
                              │
                              │ (References)
                              │
                              ├──► pools
                              ├──► cottages
                              └──► eventHalls
```

### Indexes for Performance

```javascript
// bookings collection
db.bookings.createIndex({ checkInDate: 1, checkOutDate: 1 })
db.bookings.createIndex({ userId: 1 })
db.bookings.createIndex({ status: 1 })
db.bookings.createIndex({ bookingType: 1 })

// users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
```

### Data Validation (Mongoose Schemas)

```javascript
// Example: Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['pool', 'cottage', 'event-hall'],
    required: true
  },
  checkInDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v >= new Date();
      },
      message: 'Check-in date must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });
```

---

## API Communication Protocol

### Request Format

```javascript
// Example: Create Booking
POST https://api.pahinga-resort.com/api/bookings
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Body:
{
  "bookingType": "pool",
  "resourceId": "507f1f77bcf86cd799439011",
  "checkInDate": "2026-04-10",
  "checkOutDate": "2026-04-12",
  "numberOfGuests": 15,
  "customerName": "Juan dela Cruz",
  "email": "juan@example.com",
  "phone": "+63 912 345 6789",
  "specialRequests": "Need extra chairs"
}
```

### Response Format

```javascript
// Success Response
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bookingType": "pool",
    "customerName": "Juan dela Cruz",
    "checkInDate": "2026-04-10T00:00:00.000Z",
    "checkOutDate": "2026-04-12T00:00:00.000Z",
    "status": "confirmed",
    "totalPrice": 5000,
    "createdAt": "2026-04-08T10:30:00.000Z"
  },
  "message": "Booking created successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Resource not available for selected dates"
  }
}
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────┐
│         FRONTEND DEPLOYMENT                 │
│                                             │
│  Hosting: Vercel / Netlify / AWS S3        │
│  • React build files (static)              │
│  • CDN distribution                        │
│  • HTTPS enabled                           │
│  • Auto-scaling                            │
└─────────────┬───────────────────────────────┘
              │
              │ API Calls
              │
┌─────────────▼───────────────────────────────┐
│         BACKEND DEPLOYMENT                  │
│                                             │
│  Hosting: Heroku / AWS EC2 / DigitalOcean  │
│  • Node.js runtime                         │
│  • Express server                          │
│  • PM2 process manager                     │
│  • Load balancer                           │
│  • Auto-scaling                            │
└─────────────┬───────────────────────────────┘
              │
              │ MongoDB Connection
              │
┌─────────────▼───────────────────────────────┐
│       DATABASE DEPLOYMENT                   │
│                                             │
│  MongoDB Atlas:                             │
│  • Cloud-hosted cluster                    │
│  • Automatic backups                       │
│  • Replica sets                            │
│  • Point-in-time recovery                  │
│  • Connection pooling                      │
└─────────────────────────────────────────────┘
```

---

## Real-Time Features

### WebSocket Integration (Optional Future Enhancement)

For real-time booking updates across all connected clients:

```javascript
// Backend: Socket.io
io.on('connection', (socket) => {
  socket.on('booking:created', (booking) => {
    io.emit('booking:update', booking);
  });
});

// Frontend: React
useEffect(() => {
  socket.on('booking:update', (booking) => {
    updateBookingContext(booking);
  });
}, []);
```

---

## Performance Optimizations

1. **Frontend**
   - Code splitting with React.lazy()
   - Memoization with React.memo()
   - Debouncing for search/filter inputs
   - Image optimization and lazy loading

2. **Backend**
   - Connection pooling for MongoDB
   - Caching frequently accessed data (Redis)
   - Pagination for large datasets
   - Indexing database queries

3. **Database**
   - Compound indexes for common queries
   - Aggregation pipeline optimization
   - Proper schema design (denormalization where needed)

---

## Monitoring & Logging

```javascript
// Backend logging
const winston = require('winston');

logger.info('Booking created', {
  userId: user._id,
  bookingId: booking._id,
  timestamp: new Date()
});

// Error tracking
logger.error('Database connection failed', {
  error: err.message,
  stack: err.stack
});
```

---

## Environment Configuration

### Frontend (.env)
```
REACT_APP_API_URL=https://api.pahinga-resort.com
REACT_APP_ENVIRONMENT=production
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pahinga
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://pahinga-resort.com
```

---

## Backup & Recovery

1. **MongoDB Atlas Automated Backups**
   - Continuous backups
   - Point-in-time recovery (last 24 hours)
   - Snapshot retention (7 days)

2. **Application-Level Backups**
   - Daily database exports
   - Git version control for code

---

## Scalability Considerations

1. **Horizontal Scaling**
   - Multiple backend server instances
   - Load balancer distribution
   - Stateless API design (JWT-based)

2. **Database Scaling**
   - MongoDB Atlas auto-scaling
   - Read replicas for queries
   - Sharding for large datasets

3. **Caching Layer**
   - Redis for session storage
   - CDN for static assets
   - API response caching

---

## Future Enhancements

1. **Payment Integration**
   - Stripe/PayPal for online payments
   - Booking deposits and refunds

2. **Email Notifications**
   - Booking confirmations
   - Reminder emails
   - Status updates

3. **SMS Integration**
   - Booking confirmations via SMS
   - Real-time notifications

4. **Mobile Application**
   - React Native for iOS/Android
   - Push notifications
   - Offline support

---

## Conclusion

The PAHINGA Resort Management System uses a modern, scalable architecture with:
- **React.js** providing a responsive, interactive frontend
- **Node.js/Express** serving as a robust, RESTful API backend
- **MongoDB Atlas** offering flexible, cloud-based data storage

This architecture ensures high performance, security, and maintainability while supporting the resort's booking and management needs.
