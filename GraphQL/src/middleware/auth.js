const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * 
 * @description Verifies JWT token from Authorization header and attaches user info to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @example
 * // Sample Input (HTTP Header):
 * // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * // Sample Output (req.user):
 * // {
 * //   userId: "507f1f77bcf86cd799439011",
 * //   email: "user@example.com",
 * //   iat: 1234567890,
 * //   exp: 1234567890
 * // }
 * 
 * @throws {Error} If token is invalid or missing
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      req.isAuthenticated = false;
      return next();
    }

    // Extract token (format: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      req.isAuthenticated = false;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    req.isAuthenticated = true;
    
    next();
  } catch (error) {
    req.isAuthenticated = false;
    next();
  }
};

/**
 * Require Authentication
 * 
 * @description Throws error if user is not authenticated
 * @param {Object} context - GraphQL context object
 * 
 * @example
 * // Usage in resolver:
 * // const user = requireAuth(context);
 * 
 * // Sample Input:
 * // context = { user: { userId: "123", email: "user@example.com" }, isAuthenticated: true }
 * 
 * // Sample Output:
 * // { userId: "123", email: "user@example.com" }
 * 
 * @throws {Error} If user is not authenticated
 * @returns {Object} User object from context
 */
const requireAuth = (context) => {
  if (!context.isAuthenticated || !context.user) {
    throw new Error('Authentication required. Please login.');
  }
  return context.user;
};

/**
 * Generate JWT Token
 * 
 * @description Creates a JWT token for authenticated user
 * @param {Object} payload - Data to encode in token
 * @param {string} payload.userId - User's ID
 * @param {string} payload.email - User's email
 * 
 * @example
 * // Sample Input:
 * // { userId: "507f1f77bcf86cd799439011", email: "user@example.com" }
 * 
 * // Sample Output:
 * // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTYzNTE3MjY5MH0.abc123..."
 * 
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = {
  authMiddleware,
  requireAuth,
  generateToken,
};

// Made with Bob
