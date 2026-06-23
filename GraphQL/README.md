# GraphQL Express MongoDB Application

A complete, production-ready GraphQL API built with Express.js and MongoDB, featuring JWT authentication, layered architecture, and comprehensive documentation.

## 🚀 Features

- **GraphQL API** - Flexible, type-safe API with queries and mutations
- **JWT Authentication** - Secure token-based authentication
- **MongoDB Database** - NoSQL database with Mongoose ODM
- **Layered Architecture** - Clean separation of concerns
- **User Management** - Registration, login, profile management
- **Order Management** - Create, update, and track orders
- **Comprehensive Documentation** - Detailed README in every folder
- **Error Handling** - Robust error handling throughout
- **Security** - Password hashing, JWT tokens, authorization checks

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing with GraphiQL](#testing-with-graphiql)
- [Example Queries and Mutations](#example-queries-and-mutations)
- [Learning Resources](#learning-resources)

## 🏗️ Architecture

This application follows a layered architecture pattern:

```
Client Request
    ↓
Express Server
    ↓
GraphQL Middleware (schema validation)
    ↓
Auth Middleware (JWT validation)
    ↓
GraphQL Resolvers (request handling)
    ↓
Service Layer (business logic)
    ↓
Repository Layer (data access)
    ↓
Mongoose Models (data validation)
    ↓
MongoDB Database
```

### Layer Responsibilities

1. **GraphQL Layer** (`src/graphql/`)
   - Defines API schema and types
   - Handles client requests via resolvers
   - Validates query/mutation structure

2. **Middleware Layer** (`src/middleware/`)
   - JWT token validation
   - Authentication checks
   - Request context setup

3. **Service Layer** (`src/services/`)
   - Business logic implementation
   - Authorization checks
   - Complex operation orchestration

4. **Repository Layer** (`src/repositories/`)
   - Database query abstraction
   - CRUD operations
   - Data access logic

5. **Model Layer** (`src/models/`)
   - Data structure definition
   - Validation rules
   - Database schema

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

## 🔧 Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/abhil_ibm/Documents/Learning/nodeApp
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
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/graphql-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Configuration Options

- **PORT**: Server port (default: 4000)
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
🚀 Server running on port 4000
📊 GraphQL endpoint: http://localhost:4000/graphql
🔍 GraphiQL interface: http://localhost:4000/graphql
💚 Health check: http://localhost:4000/health
```

## 📚 API Documentation

### Endpoints

- **GraphQL API**: `http://localhost:4000/graphql`
- **Health Check**: `http://localhost:4000/health`
- **Root**: `http://localhost:4000/`

### Authentication

Most operations require authentication. Include JWT token in headers:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Available Operations

#### User Operations
- `register` - Create new user account
- `login` - Authenticate and get JWT token
- `me` - Get current user info
- `user(id)` - Get user by ID
- `users` - Get all users (paginated)
- `updateUser` - Update user profile
- `deleteUser` - Delete user account

#### Order Operations
- `createOrder` - Create new order
- `order(id)` - Get order by ID
- `myOrders` - Get current user's orders
- `orders` - Get all orders (admin)
- `ordersByStatus` - Filter orders by status
- `updateOrderStatus` - Update order status
- `cancelOrder` - Cancel an order
- `deleteOrder` - Delete an order (admin)

## 📁 Project Structure

```
nodeApp/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   └── README.md     # Config documentation
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT authentication
│   │   └── README.md     # Middleware documentation
│   │
│   ├── models/           # Mongoose models
│   │   ├── User.js       # User schema
│   │   ├── Order.js      # Order schema
│   │   └── README.md     # Models documentation
│   │
│   ├── repositories/     # Data access layer
│   │   ├── userRepository.js
│   │   ├── orderRepository.js
│   │   └── README.md     # Repository documentation
│   │
│   ├── services/         # Business logic layer
│   │   ├── userService.js
│   │   ├── orderService.js
│   │   └── README.md     # Services documentation
│   │
│   ├── graphql/          # GraphQL layer
│   │   ├── schema.js     # GraphQL schema
│   │   ├── resolvers.js  # GraphQL resolvers
│   │   └── README.md     # GraphQL documentation
│   │
│   └── server.js         # Express server entry point
│
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
└── README.md           # This file
```

### Folder Documentation

Each folder contains a detailed README explaining:
- Purpose of the folder
- What each file does
- Function descriptions with sample inputs/outputs
- Usage examples
- Best practices

## 🧪 Testing with GraphiQL

GraphiQL is an interactive GraphQL IDE available in development mode.

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open GraphiQL:**
   ```
   http://localhost:4000/graphql
   ```

3. **Features:**
   - Auto-completion
   - Schema documentation
   - Query history
   - Variable support

## 📝 Example Queries and Mutations

### 1. Register a New User

```graphql
mutation {
  register(
    name: "John Doe"
    email: "john@example.com"
    password: "password123"
  ) {
    user {
      _id
      name
      email
    }
    token
  }
}
```

**Response:**
```json
{
  "data": {
    "register": {
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 2. Login

```graphql
mutation {
  login(
    email: "john@example.com"
    password: "password123"
  ) {
    user {
      _id
      name
      email
    }
    token
  }
}
```

### 3. Get Current User (Requires Authentication)

**Set HTTP Header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query:**
```graphql
query {
  me {
    _id
    name
    email
    createdAt
  }
}
```

### 4. Create an Order (Requires Authentication)

**Set HTTP Header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Mutation:**
```graphql
mutation {
  createOrder(
    items: [
      { productName: "Laptop", quantity: 1, price: 999.99 }
      { productName: "Mouse", quantity: 2, price: 25.50 }
    ]
    shippingAddress: {
      street: "123 Main St"
      city: "New York"
      state: "NY"
      zipCode: "10001"
      country: "USA"
    }
  ) {
    _id
    totalAmount
    status
    items {
      productName
      quantity
      price
    }
    shippingAddress {
      street
      city
      state
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "createOrder": {
      "_id": "507f1f77bcf86cd799439012",
      "totalAmount": 1050.99,
      "status": "pending",
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
        "state": "NY"
      }
    }
  }
}
```

### 5. Get My Orders (Requires Authentication)

```graphql
query {
  myOrders(limit: 10) {
    _id
    totalAmount
    status
    createdAt
    items {
      productName
      quantity
      price
    }
  }
}
```

### 6. Update Order Status (Requires Authentication)

```graphql
mutation {
  updateOrderStatus(
    id: "507f1f77bcf86cd799439012"
    status: "shipped"
  ) {
    _id
    status
    updatedAt
  }
}
```

### 7. Cancel Order (Requires Authentication)

```graphql
mutation {
  cancelOrder(id: "507f1f77bcf86cd799439012") {
    _id
    status
  }
}
```

### 8. Get All Users (Requires Authentication)

```graphql
query {
  users(limit: 10, skip: 0) {
    _id
    name
    email
    createdAt
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

## 🎓 Learning Resources

### GraphQL
- [GraphQL Official Documentation](https://graphql.org/learn/)
- [How to GraphQL](https://www.howtographql.com/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

### Express.js
- [Express.js Documentation](https://expressjs.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### MongoDB & Mongoose
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/)

### JWT Authentication
- [JWT.io](https://jwt.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

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
# Find process using port 4000
lsof -i :4000

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

Created as a learning project for GraphQL, Express, and MongoDB integration.

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

## 📞 Support

For issues or questions:
1. Check the README files in each folder
2. Review the inline code documentation
3. Test with GraphiQL interface
4. Check MongoDB connection and logs

---

**Happy Learning! 🚀**