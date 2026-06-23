const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * 
 * @description Mongoose schema for User collection
 * Defines the structure and validation rules for user documents
 * 
 * Fields:
 * - name: User's full name (required, trimmed)
 * - email: User's email address (required, unique, lowercase)
 * - password: Hashed password (required, min 6 characters)
 * - createdAt: Timestamp of user creation
 * - updatedAt: Timestamp of last update
 * 
 * @example
 * // Sample Document:
 * // {
 * //   _id: "507f1f77bcf86cd799439011",
 * //   name: "John Doe",
 * //   email: "john@example.com",
 * //   password: "$2a$10$...", // hashed
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save Hook - Hash Password
 * 
 * @description Automatically hashes password before saving to database
 * Only runs if password is modified
 * 
 * @example
 * // Before save:
 * // user.password = "mypassword123"
 * 
 * // After save:
 * // user.password = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
 */
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare Password Method
 * 
 * @description Compares plain text password with hashed password
 * @param {string} candidatePassword - Plain text password to compare
 * 
 * @example
 * // Sample Input:
 * // candidatePassword = "mypassword123"
 * 
 * // Sample Output:
 * // true (if password matches)
 * // false (if password doesn't match)
 * 
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * To JSON Method
 * 
 * @description Removes sensitive fields when converting to JSON
 * @returns {Object} User object without password field
 * 
 * @example
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439011",
 * //   name: "John Doe",
 * //   email: "john@example.com",
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// Made with Bob
