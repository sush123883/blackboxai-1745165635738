require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Canteen Food Ordering System Backend is running');
});

// Import auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import menu routes
const menuRoutes = require('./routes/menu');
app.use('/api/menu', menuRoutes);

// Import order routes
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

// Import admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Import payment routes
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// Import notification routes
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// Import promotions routes
const promotionsRoutes = require('./routes/promotions');
app.use('/api/promotions', promotionsRoutes);

// Import loyalty routes
const loyaltyRoutes = require('./routes/loyalty');
app.use('/api/loyalty', loyaltyRoutes);

// Import review routes
const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

// Import recommendations routes
const recommendationsRoutes = require('./routes/recommendations');
app.use('/api/recommendations', recommendationsRoutes);

// Import analytics routes
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

initSocket(server);

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
