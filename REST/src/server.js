require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

/**
 * Express REST API Server
 * 
 * @description Main server file that sets up Express with REST endpoints
 * Includes middleware for CORS, JSON parsing, and routing
 * 
 * Architecture Flow:
 * 1. Client Request → Express Server
 * 2. CORS Middleware → Handles cross-origin requests
 * 3. JSON Parser → Parses request body
 * 4. Routes → Direct to appropriate controller
 * 5. Auth Middleware → Validates JWT tokens (on protected routes)
 * 6. Controllers → Handle requests and responses
 * 7. Services → Business logic layer
 * 8. Repositories → Data access layer
 * 9. Models → MongoDB schemas
 * 10. MongoDB Database
 */

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

/**
 * API Routes
 * 
 * @description Mount route handlers for different resources
 */
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

/**
 * Health Check Endpoint
 * 
 * @route GET /health
 * @description Simple health check endpoint to verify server is running
 * 
 * @example
 * // GET http://localhost:3000/health
 * // Response: { "status": "OK", "message": "Server is running" }
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Root Endpoint
 * 
 * @route GET /
 * @description Welcome message with API information
 */
app.get('/', (req, res) => {
  res.json({
    message: 'REST API with Express and MongoDB',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      orders: '/api/orders',
      health: '/health',
    },
    documentation: 'See README.md for API documentation',
  });
});

/**
 * 404 Handler
 * 
 * @description Handles requests to undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/**
 * Error Handler
 * 
 * @description Global error handling middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

/**
 * Start Server
 * 
 * @description Connects to MongoDB and starts Express server
 * 
 * Steps:
 * 1. Connect to MongoDB database
 * 2. Start Express server on specified port
 * 3. Log server information
 * 
 * Environment Variables:
 * - PORT: Server port (default: 3000)
 * - MONGODB_URI: MongoDB connection string
 * - NODE_ENV: Environment (development/production)
 */
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 REST API: http://localhost:${PORT}/api`);
      console.log(`👤 Users: http://localhost:${PORT}/api/users`);
      console.log(`📦 Orders: http://localhost:${PORT}/api/orders`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;

// Made with Bob
