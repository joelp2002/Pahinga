import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    let user;
    if (global.simpleDB) {
      user = global.simpleDB.findUser({ username });
    } else {
      user = await User.findOne({ username });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, name: user.name },
      secret,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: { username: user.username, role: user.role, name: user.name }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, name, role } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Username, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userRole = role === 'admin' ? 'admin' : 'employee';

    if (global.simpleDB) {
      const existingUser = global.simpleDB.findUser({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      return res.status(201).json({ message: 'User registered successfully' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: userRole,
      name,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { username: newUser.username, role: newUser.role, name: newUser.name }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

export default router;
