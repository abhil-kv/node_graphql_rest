const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../middleware/auth');

/**
 * User Service
 * 
 * @description Business logic layer for User operations
 * Handles authentication, validation, and user management
 */

/**
 * Register User
 * 
 * @description Creates a new user account and returns JWT token
 * @param {Object} userData - User registration data
 * 
 * @example
 * // Sample Input: { name: "John Doe", email: "john@example.com", password: "password123" }
 * // Sample Output: { user: {...}, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 * 
 * @returns {Promise<Object>} Object containing user and JWT token
 */
const register = async (userData) => {
  try {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await userRepository.create(userData);
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return { user, token };
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

/**
 * Login User
 * 
 * @description Authenticates user and returns JWT token
 * @param {string} email - User's email
 * @param {string} password - User's password
 * 
 * @example
 * // Sample Input: "john@example.com", "password123"
 * // Sample Output: { user: {...}, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 * 
 * @returns {Promise<Object>} Object containing user and JWT token
 */
const login = async (email, password) => {
  try {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const userObject = user.toJSON();
    return { user: userObject, token };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

/**
 * Get User by ID
 * 
 * @description Retrieves user information by ID
 * @param {string} id - User's MongoDB ObjectId
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "...", name: "John Doe", email: "john@example.com" }
 * 
 * @returns {Promise<Object>} User object
 */
const getUserById = async (id) => {
  try {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error getting user: ${error.message}`);
  }
};

/**
 * Get All Users
 * 
 * @description Retrieves all users with pagination
 * @param {number} limit - Maximum number of users to return
 * @param {number} skip - Number of users to skip
 * 
 * @example
 * // Sample Input: 10, 0
 * // Sample Output: [{ _id: "...", name: "John Doe", email: "john@example.com" }, ...]
 * 
 * @returns {Promise<Array>} Array of user objects
 */
const getAllUsers = async (limit = 10, skip = 0) => {
  try {
    return await userRepository.findAll(limit, skip);
  } catch (error) {
    throw new Error(`Error getting users: ${error.message}`);
  }
};

/**
 * Update User
 * 
 * @description Updates user information with authorization check
 * @param {string} id - User's MongoDB ObjectId
 * @param {Object} updateData - Data to update
 * @param {string} requestUserId - ID of user making the request
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439011", { name: "Jane Doe" }, "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "...", name: "Jane Doe", email: "john@example.com" }
 * 
 * @returns {Promise<Object>} Updated user object
 */
const updateUser = async (id, updateData, requestUserId) => {
  try {
    if (id !== requestUserId) {
      throw new Error('Unauthorized: You can only update your own profile');
    }

    if (updateData.password) {
      delete updateData.password;
    }

    const user = await userRepository.update(id, updateData);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

/**
 * Delete User
 * 
 * @description Deletes a user account with authorization check
 * @param {string} id - User's MongoDB ObjectId
 * @param {string} requestUserId - ID of user making the request
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439011", "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "...", name: "John Doe", email: "john@example.com" }
 * 
 * @returns {Promise<Object>} Deleted user object
 */
const deleteUser = async (id, requestUserId) => {
  try {
    if (id !== requestUserId) {
      throw new Error('Unauthorized: You can only delete your own account');
    }

    const user = await userRepository.deleteUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

module.exports = {
  register,
  login,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};

// Made with Bob
