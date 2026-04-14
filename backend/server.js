import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import serviceRoutes from './routes/services.js';
import SimpleDB from './models/SimpleDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
  const dbType = global.simpleDB ? 'SimpleDB' : 'MongoDB';
  res.send(`PAHINGA API is running with ${dbType}!`);
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} with MongoDB`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB, falling back to SimpleDB:', err.message);
    global.simpleDB = SimpleDB;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} with SimpleDB`);
    });
  });
