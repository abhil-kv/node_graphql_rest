const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * 
 * @description Establishes connection to MongoDB using Mongoose
 * @returns {Promise<void>} Resolves when connection is successful
 * 
 * @example
 * // Usage in server.js
 * const connectDB = require('./config/database');
 * await connectDB();
 * 
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

// Made with Bob
