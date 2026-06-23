const User = require('../models/User');

/**
 * User Repository
 * 
 * @description Data access layer for User model
 * Handles all database operations for users
 */

/**
 * Find User by ID
 * 
 * @description Retrieves a user by their ID
 * @param {string} id - User's MongoDB ObjectId
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "507f1f77bcf86cd799439011", name: "John Doe", email: "john@example.com" }
 * 
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
};

/**
 * Find User by Email
 * 
 * @description Retrieves a user by their email address
 * @param {string} email - User's email address
 * @param {boolean} includePassword - Whether to include password field
 * 
 * @example
 * // Sample Input: "john@example.com", false
 * // Sample Output: { _id: "...", name: "John Doe", email: "john@example.com" }
 * 
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findByEmail = async (email, includePassword = false) => {
  try {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return await query;
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

/**
 * Find All Users
 * 
 * @description Retrieves all users with optional pagination
 * @param {number} limit - Maximum number of users to return
 * @param {number} skip - Number of users to skip
 * 
 * @example
 * // Sample Input: 10, 0
 * // Sample Output: [{ _id: "...", name: "John Doe", email: "john@example.com" }, ...]
 * 
 * @returns {Promise<Array>} Array of user objects
 */
const findAll = async (limit = 10, skip = 0) => {
  try {
    return await User.find().limit(limit).skip(skip).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error finding all users: ${error.message}`);
  }
};

/**
 * Create User
 * 
 * @description Creates a new user in the database
 * @param {Object} userData - User data object
 * 
 * @example
 * // Sample Input: { name: "John Doe", email: "john@example.com", password: "password123" }
 * // Sample Output: { _id: "...", name: "John Doe", email: "john@example.com", createdAt: "..." }
 * 
 * @returns {Promise<Object>} Created user object
 */
const create = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw new Error(`Error creating user: ${error.message}`);
  }
};

/**
 * Update User
 * 
 * @description Updates an existing user
 * @param {string} id - User's MongoDB ObjectId
 * @param {Object} updateData - Data to update
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439011", { name: "Jane Doe" }
 * // Sample Output: { _id: "...", name: "Jane Doe", email: "john@example.com", updatedAt: "..." }
 * 
 * @returns {Promise<Object|null>} Updated user object or null if not found
 */
const update = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

/**
 * Delete User
 * 
 * @description Deletes a user from the database
 * @param {string} id - User's MongoDB ObjectId
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "...", name: "John Doe", email: "john@example.com" }
 * 
 * @returns {Promise<Object|null>} Deleted user object or null if not found
 */
const deleteUser = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

module.exports = {
  findById,
  findByEmail,
  findAll,
  create,
  update,
  deleteUser,
};

// Made with Bob
