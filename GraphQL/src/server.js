require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const connectDB = require('./config/database');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { authMiddleware } = require('./middleware/auth');

/**
 * Express Server with GraphQL
 * 
 * @description Main server file that sets up Express with GraphQL endpoint
 * Includes middleware for CORS, authentication, and GraphQL
 * 
 * Architecture Flow:
 * 1. Client Request → Express Server
 * 2. CORS Middleware → Handles cross-origin requests
 * 3. Auth Middleware → Validates JWT tokens
 * 4. GraphQL Middleware → Processes GraphQL queries/mutations
 * 5. Resolvers → Business logic handlers
 * 6. Services → Business logic layer
 * 7. Repositories → Data access layer
 * 8. Models → MongoDB schemas
 * 9. MongoDB Database
 */

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(authMiddleware); // Attach user info to request if authenticated

/**
 * GraphQL Endpoint
 * 
 * @route POST /graphql
 * @description Main GraphQL endpoint for all queries and mutations
 * 
 * Features:
 * - GraphiQL interface enabled in development for testing
 * - Custom error formatting
 * - Context includes user authentication info
 * 
 * @example
 * // Access GraphiQL interface:
 * // http://localhost:4000/graphql
 * 
 * // Sample Query:
 * // POST http://localhost:4000/graphql
 * // Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
 * // Body: {
 * //   "query": "query { me { _id name email } }"
 * // }
 */
app.use(
  '/graphql',
  graphqlHTTP((req) => ({
    schema: schema,
    rootValue: resolvers,
    context: {
      user: req.user,
      isAuthenticated: req.isAuthenticated,
    },
    graphiql: process.env.NODE_ENV === 'development', // Enable GraphiQL in development
    customFormatErrorFn: (error) => ({
      message: error.message,
      locations: error.locations,
      path: error.path,
    }),
  }))
);

/**
 * Health Check Endpoint
 * 
 * @route GET /health
 * @description Simple health check endpoint to verify server is running
 * 
 * @example
 * // GET http://localhost:4000/health
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
    message: 'GraphQL Express MongoDB API',
    graphql: '/graphql',
    health: '/health',
    documentation: 'See README.md for API documentation',
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
 * - PORT: Server port (default: 4000)
 * - MONGODB_URI: MongoDB connection string
 * - NODE_ENV: Environment (development/production)
 */
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 GraphiQL interface: http://localhost:${PORT}/graphql`);
      }
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
