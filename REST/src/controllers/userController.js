const userService = require('../services/userService');
const { validationResult } = require('express-validator');

/**
 * User Controller
 * 
 * @description Handles HTTP requests for user operations
 * Validates input, calls service layer, and formats responses
 */

/**
 * Register User
 * 
 * @route POST /api/users/register
 * @description Register a new user account
 * @access Public
 * 
 * @example
 * // Request Body:
 * // { "name": "John Doe", "email": "john@example.com", "password": "password123" }
 * 
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": {
 * //     "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
 * //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * //   }
 * // }
 */
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;
    const result = await userService.register({ name, email, password });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Login User
 * 
 * @route POST /api/users/login
 * @description Authenticate user and get token
 * @access Public
 * 
 * @example
 * // Request Body:
 * // { "email": "john@example.com", "password": "password123" }
 * 
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": {
 * //     "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
 * //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * //   }
 * // }
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const result = await userService.login(email, password);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Current User
 * 
 * @route GET /api/users/me
 * @description Get current authenticated user
 * @access Private
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
 * // }
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get User by ID
 * 
 * @route GET /api/users/:id
 * @description Get user by ID
 * @access Private
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
 * // }
 */
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get All Users
 * 
 * @route GET /api/users
 * @description Get all users with pagination
 * @access Private
 * @query limit - Maximum number of users (default: 10)
 * @query skip - Number of users to skip (default: 0)
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": [
 * //     { "_id": "...", "name": "John Doe", "email": "john@example.com" },
 * //     { "_id": "...", "name": "Jane Smith", "email": "jane@example.com" }
 * //   ]
 * // }
 */
const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const users = await userService.getAllUsers(limit, skip);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update User
 * 
 * @route PUT /api/users/:id
 * @description Update user information
 * @access Private
 * 
 * @example
 * // Request Body:
 * // { "name": "Jane Doe" }
 * 
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": { "_id": "...", "name": "Jane Doe", "email": "john@example.com" }
 * // }
 */
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await userService.updateUser(
      req.params.id,
      req.body,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete User
 * 
 * @route DELETE /api/users/:id
 * @description Delete user account
 * @access Private
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
 * // }
 */
const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};

// Made with Bob
