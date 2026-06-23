# Config Folder

## Purpose
This folder contains configuration files for the application, including database connections and other environment-specific settings.

## Files

### database.js
**Purpose:** Manages MongoDB database connection using Mongoose.

**What it does:**
- Establishes connection to MongoDB database
- Handles connection errors and retries
- Logs connection status
- Exports connection function for use in server startup

**Functions:**

#### `connectDB()`
Connects to MongoDB database using connection string from environment variables.

**Sample Input:**
```javascript
// Environment variable required:
// MONGODB_URI=mongodb://localhost:27017/graphql-app

const connectDB = require('./config/database');
await connectDB();
```

**Sample Output:**
```
MongoDB Connected: localhost
```

**Error Handling:**
- Throws error if connection fails
- Exits process with code 1 on failure
- Logs detailed error messages

## Usage Example

```javascript
// In server.js
const connectDB = require('./config/database');

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};
```

## Environment Variables Required
- `MONGODB_URI`: MongoDB connection string (e.g., mongodb://localhost:27017/graphql-app)

## Dependencies
- mongoose: MongoDB object modeling tool