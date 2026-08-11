const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const { inMemoryUsers } = require('../store/inMemoryStore');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-key-12345';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ msg: 'Email already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword });
      return res.status(201).json({ msg: 'User registered successfully', user: { name: newUser.name, email: newUser.email } });
    } else {
      const userExists = inMemoryUsers.find(u => u.email === email);
      if (userExists) return res.status(400).json({ msg: 'Email already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };
      inMemoryUsers.push(newUser);
      return res.status(201).json({ msg: 'User registered successfully', user: { name: newUser.name, email: newUser.email } });
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }
  try {
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
    } else {
      user = inMemoryUsers.find(u => u.email === email);
    }

    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const userId = user._id ? user._id : user.id;
    const token = jwt.sign({ id: userId, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Verify token / Current User
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ user: { id: decoded.id, name: decoded.name, email: decoded.email } });
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
});

module.exports = router;
