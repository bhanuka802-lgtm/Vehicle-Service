const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const customerRoutes = require('./src/routes/customerRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const invoiceRoutes = require('./src/routes/invoiceRoutes');

// Use Routes
app.use('/api/customers', customerRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/invoices', invoiceRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Vehicle Service Booking System API is running');
});

// Create src/routes directory placeholders to avoid crash while scaffolding
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle_service_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
