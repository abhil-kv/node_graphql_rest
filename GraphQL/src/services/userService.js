const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../middleware/auth');

/**
 * User Service
 * 
 * @description Business logic layer for User operations
 * Handles authentication, validation, and user management
 * Acts as intermediary between resolvers and repository
 */

/**
 * Register User
 * 
 * @description Creates a new user account and returns JWT token
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * 
 * @example
 * // Sample Input:
 * // {
 * //   name: "John Doe",
 * //   email: "john@example.com",
 * //   password: "password123"
 * // }
 * 
 * // Sample Output:
 * // {
 * //   user: {
 * //     _id: "507f1f77bcf86cd799439011",
 * //     name: "John Doe",
 * //     email: "john@example.com",
 * //     createdAt: "2024-01-15T10:30:00.000Z",
 * //     updatedAt: "2024-01-15T10:30:00.000Z"
 * //   },
 * //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * // }
 * 
 * @returns {Promise<Object>} Object containing user and JWT token
 * @throws {Error} If email already exists or validation fails
 */
const register = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await userRepository.create(userData);

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      user,
      token,
    };
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
 * // Sample Input:
 * // email = "john@example.com"
 * // password = "password123"
 * 
 * // Sample Output:
 * // {
 * //   user: {
 * //     _id: "507f1f77bcf86cd799439011",
 * //     name: "John Doe",
 * //     email: "john@example.com",
 * //     createdAt: "2024-01-15T10:30:00.000Z",
 * //     updatedAt: "2024-01-15T10:30:00.000Z"
 * //   },
 * //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * // }
 * 
 * @returns {Promise<Object>} Object containing user and JWT token
 * @throws {Error} If credentials are invalid
 */
const login = async (email, password) => {
  try {
    // Find user with password field
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Remove password from response
    const userObject = user.toJSON();

    return {
      user: userObject,
      token,
    };
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
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439011"
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439011",
 * //   name: "John Doe",
 * //   email: "john@example.com",
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} User object
 * @throws {Error} If user not found
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
 * // Sample Input:
 * // limit = 10, skip = 0
 * 
 * // Sample Output:
 * // [
 * //   {
 * //     _id: "507f1f77bcf86cd799439011",
 * //     name: "John Doe",
 * //     email: "john@example.com",
 * //     createdAt: "2024-01-15T10:30:00.000Z",
 * //     updatedAt: "2024-01-15T10:30:00.000Z"
 * //   },
 * //   { ... }
 * // ]
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
 * @description Updates user information
 * @param {string} id - User's MongoDB ObjectId
 * @param {Object} updateData - Data to update
 * @param {string} requestUserId - ID of user making the request (for authorization)
 * 
 * @example
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439011"
 * // updateData = { name: "Jane Doe" }
 * // requestUserId = "507f1f77bcf86cd799439011"
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439011",
 * //   name: "Jane Doe",
 * //   email: "john@example.com",
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T11:00:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} Updated user object
 * @throws {Error} If user not found or unauthorized
 */
const updateUser = async (id, updateData, requestUserId) => {
  try {
    // Check authorization - users can only update their own profile
    if (id !== requestUserId) {
      throw new Error('Unauthorized: You can only update your own profile');
    }

    // Prevent password update through this method
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
 * @description Deletes a user account
 * @param {string} id - User's MongoDB ObjectId
 * @param {string} requestUserId - ID of user making the request (for authorization)
 * 
 * @example
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439011"
 * // requestUserId = "507f1f77bcf86cd799439011"
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439011",
 * //   name: "John Doe",
 * //   email: "john@example.com",
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} Deleted user object
 * @throws {Error} If user not found or unauthorized
 */
const deleteUser = async (id, requestUserId) => {
  try {
    // Check authorization - users can only delete their own account
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
