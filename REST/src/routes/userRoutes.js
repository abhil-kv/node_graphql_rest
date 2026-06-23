const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const { body } = require('express-validator');

/**
 * User Routes
 * 
 * @description Defines all routes for user operations
 * Includes validation middleware and authentication where required
 */

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  userController.register
);

/**
 * @route   POST /api/users/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  userController.login
);

/**
 * @route   GET /api/users/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authMiddleware, userController.getCurrentUser);

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination)
 * @access  Private
 * @query   limit - Maximum number of users (default: 10)
 * @query   skip - Number of users to skip (default: 0)
 */
router.get('/', authMiddleware, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user information
 * @access  Private
 */
router.put(
  '/:id',
  authMiddleware,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
  ],
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;

// Made with Bob
