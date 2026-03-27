require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const sessionRoutes = require('./routes/session');
const subscriptionRoutes = require('./routes/subscriptions');
const dashboardRoutes = require('./routes/dashboard');
const recommendationsRoutes = require('./routes/recommendations');

// Import middlewares
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', // Vite fallback
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/session', sessionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api', dashboardRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
