# REST API with Express and MongoDB

A complete, production-ready REST API built with Express.js and MongoDB, featuring JWT authentication, layered architecture, comprehensive CRUD operations, and detailed documentation.

## 🚀 Features

- **RESTful API** - Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **JWT Authentication** - Secure token-based authentication
- **MongoDB Database** - NoSQL database with Mongoose ODM
- **Layered Architecture** - Clean separation of concerns
- **User Management** - Complete CRUD operations for users
- **Order Management** - Complete CRUD operations for orders
- **Input Validation** - Request validation using express-validator
- **Error Handling** - Comprehensive error handling
- **Security** - Password hashing, JWT tokens, authorization checks

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing with Postman/cURL](#testing-with-postmancurl)
- [Example Requests](#example-requests)

## 🏗️ Architecture

This application follows a layered architecture pattern:

```
Client Request
    ↓
Express Server
    ↓
Routes (URL mapping)
    ↓
Controllers (Request handling)
    ↓
Services (Business logic)
    ↓
Repositories (Data access)
    ↓
Models (Data validation)
    ↓
MongoDB Database
```

### Layer Responsibilities

1. **Routes** (`src/routes/`)
   - Define API endpoints
   - Map URLs to controllers
   - Apply middleware (auth, validation)

2. **Controllers** (`src/controllers/`)
   - Handle HTTP requests/responses
   - Validate input data
   - Call service layer
   - Format responses

3. **Services** (`src/services/`)
   - Business logic implementation
   - Authorization checks
   - Complex operations

4. **Repositories** (`src/repositories/`)
   - Database query abstraction
   - CRUD operations
   - Data access logic

5. **Models** (`src/models/`)
   - Data structure definition
   - Validation rules
   - Database schema

## 📦 Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

## 🔧 Installation

1. **Navigate to the REST directory:**
   ```bash
   cd REST
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

## ⚙️ Configuration

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/rest-api-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Configuration Options

- **PORT**: Server port (default: 3000)
- **NODE_ENV**: Environment mode (development/production)
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT tokens (⚠️ Change in production!)
- **JWT_EXPIRES_IN**: Token expiration time (e.g., 7d, 24h, 60m)

## 🚀 Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Expected Output
```
MongoDB Connected: localhost
🚀 Server running on port 3000
📊 REST API: http://localhost:3000/api
👤 Users: http://localhost:3000/api/users
📦 Orders: http://localhost:3000/api/orders
💚 Health check: http://localhost:3000/health
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication

Include JWT token in headers for protected routes:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/register` | Register new user | No |
| POST | `/users/login` | Login user | No |
| GET | `/users/me` | Get current user | Yes |
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create new order | Yes |
| GET | `/orders/my-orders` | Get current user's orders | Yes |
| GET | `/orders` | Get all orders | Yes |
| GET | `/orders/:id` | Get order by ID | Yes |
| GET | `/orders/status/:status` | Get orders by status | Yes |
| PATCH | `/orders/:id/status` | Update order status | Yes |
| PATCH | `/orders/:id/cancel` | Cancel order | Yes |
| DELETE | `/orders/:id` | Delete order | Yes |

## 📁 Project Structure

```
REST/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # MongoDB connection
│   │
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # JWT authentication
│   │
│   ├── models/              # Mongoose models
│   │   ├── User.js          # User schema
│   │   └── Order.js         # Order schema
│   │
│   ├── repositories/        # Data access layer
│   │   ├── userRepository.js
│   │   └── orderRepository.js
│   │
│   ├── services/            # Business logic layer
│   │   ├── userService.js
│   │   └── orderService.js
│   │
│   ├── controllers/         # Request handlers
│   │   ├── userController.js
│   │   └── orderController.js
│   │
│   ├── routes/              # API routes
│   │   ├── userRoutes.js
│   │   └── orderRoutes.js
│   │
│   └── server.js            # Express server entry point
│
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
└── README.md              # This file
```

## 🧪 Testing with Postman/cURL

### Using Postman

1. Import the API endpoints into Postman
2. Set base URL: `http://localhost:3000/api`
3. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`

### Using cURL

See [Example Requests](#example-requests) below for cURL examples.

## 📝 Example Requests

### 1. Register a New User

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User (Requires Authentication)

**Request:**
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Create an Order (Requires Authentication)

**Request:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "productName": "Laptop",
        "quantity": 1,
        "price": 999.99
      },
      {
        "productName": "Mouse",
        "quantity": 2,
        "price": 25.50
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "productName": "Laptop",
        "quantity": 1,
        "price": 999.99
      },
      {
        "productName": "Mouse",
        "quantity": 2,
        "price": 25.50
      }
    ],
    "totalAmount": 1050.99,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Get My Orders (Requires Authentication)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/orders/my-orders?limit=10&skip=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "items": [...],
      "totalAmount": 1050.99,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "items": [...],
      "totalAmount": 250.50,
      "status": "shipped",
      "createdAt": "2024-01-14T09:20:00.000Z"
    }
  ]
}
```

### 6. Update Order Status (Requires Authentication)

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/orders/507f1f77bcf86cd799439012/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "shipped"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "shipped",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 7. Cancel Order (Requires Authentication)

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/orders/507f1f77bcf86cd799439012/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "cancelled",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 8. Get All Users (Requires Authentication)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/users?limit=10&skip=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2024-01-14T09:20:00.000Z"
    }
  ]
}
```

### 9. Update User (Requires Authentication)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 10. Delete User (Requires Authentication)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## 🔐 Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Validate all inputs** at multiple layers
4. **Implement rate limiting** for production
5. **Use environment variables** for sensitive data
6. **Keep dependencies updated**
7. **Implement proper logging**
8. **Add request validation middleware**

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

ISC

## 👨‍💻 Author

Created as a learning project for REST API development with Express and MongoDB.

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

---

**Happy Coding! 🚀**