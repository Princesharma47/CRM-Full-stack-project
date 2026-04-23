const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const runSeed = require('./seed');

// Routes imports
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const dashboardRoutes = require('./routes/dashboard');
const dealRoutes      = require('./routes/dealRoutes');
const path = require('path');

dotenv.config();

// Support both MONGO_URI and MONGO_URL env var names
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;
console.log('MONGO_URI defined:', !!MONGO_URI);

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // set this on Render to your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/deals',     dealRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await runSeed(); // seed demo data if collections are empty
  })
  .catch((err) => console.log('MongoDB connection error: ', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
