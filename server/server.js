const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = require('./config/db');
connectDB();

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// Set security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow loading local images in frontend
  })
);

// Enable CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowed =
      !origin ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.trycloudflare.com') ||
      origin.endsWith('.loca.lt') ||
      origin === process.env.CLIENT_URL;

    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder'],
};
app.use(cors(corsOptions));

// Set static folder for uploads
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200, // Limit to 200 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', limiter);

// Mount routers
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const products = require('./routes/productRoutes');
const categories = require('./routes/categoryRoutes');
const cart = require('./routes/cartRoutes');
const wishlist = require('./routes/wishlistRoutes');
const orders = require('./routes/orderRoutes');
const reviews = require('./routes/reviewRoutes');
const coupons = require('./routes/couponRoutes');
const payment = require('./routes/paymentRoutes');
const admin = require('./routes/adminRoutes');

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/cart', cart);
app.use('/api/wishlist', wishlist);
app.use('/api/orders', orders);
app.use('/api/reviews', reviews);
app.use('/api/coupons', coupons);
app.use('/api/payment', payment);
app.use('/api/admin', admin);

// Basic root route for server verification
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Indiacart24 E-Commerce API is running smoothly.',
  });
});

// Handling 404 routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Indiacart24 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} 🚀`);
  console.log(`==================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
