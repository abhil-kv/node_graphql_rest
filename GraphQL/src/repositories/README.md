# Repositories Folder

## Purpose
This folder contains the data access layer (repository pattern) that handles all database operations. Repositories abstract database queries from business logic, making the code more maintainable and testable.

## Architecture Pattern
The repository pattern provides:
- Separation of concerns between data access and business logic
- Centralized database query logic
- Easier testing through abstraction
- Consistent error handling
- Reusable database operations

## Files

### userRepository.js
**Purpose:** Handles all database operations for User model.

**What it does:**
- Provides CRUD operations for users
- Handles user queries and searches
- Manages password field selection
- Centralizes user data access logic

**Functions:**

#### `findById(id)`
Retrieves a user by their MongoDB ObjectId.

**Sample Input:**
```javascript
const user = await userRepository.findById("507f1f77bcf86cd799439011");
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

---

#### `findByEmail(email, includePassword)`
Retrieves a user by email address with optional password field.

**Sample Input:**
```javascript
// Without password
const user = await userRepository.findByEmail("john@example.com");

// With password (for authentication)
const userWithPassword = await userRepository.findByEmail("john@example.com", true);
```

**Sample Output:**
```javascript
// Without password
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com"
}

// With password
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$..." // hashed
}
```

---

#### `findAll(limit, skip)`
Retrieves all users with pagination support.

**Sample Input:**
```javascript
const users = await userRepository.findAll(10, 0);
```

**Sample Output:**
```javascript
[
  {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com"
  },
  {
    _id: "507f1f77bcf86cd799439012",
    name: "Jane Smith",
    email: "jane@example.com"
  }
]
```

---

#### `create(userData)`
Creates a new user in the database.

**Sample Input:**
```javascript
const newUser = await userRepository.create({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

**Error Handling:**
- Throws "Email already exists" if duplicate email (code 11000)

---

#### `update(id, updateData)`
Updates an existing user.

**Sample Input:**
```javascript
const updatedUser = await userRepository.update(
  "507f1f77bcf86cd799439011",
  { name: "Jane Doe" }
);
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "Jane Doe",
  email: "john@example.com",
  updatedAt: "2024-01-15T11:00:00.000Z"
}
```

---

#### `deleteUser(id)`
Deletes a user from the database.

**Sample Input:**
```javascript
const deletedUser = await userRepository.deleteUser("507f1f77bcf86cd799439011");
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com"
}
```

---

### orderRepository.js
**Purpose:** Handles all database operations for Order model.

**What it does:**
- Provides CRUD operations for orders
- Handles order queries with user population
- Filters orders by status and user
- Manages order relationships

**Functions:**

#### `findById(id)`
Retrieves an order by ID with populated user data.

**Sample Input:**
```javascript
const order = await orderRepository.findById("507f1f77bcf86cd799439012");
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  user: {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com"
  },
  items: [
    { productName: "Laptop", quantity: 1, price: 999.99 }
  ],
  totalAmount: 999.99,
  status: "pending",
  shippingAddress: {...}
}
```

---

#### `findByUserId(userId, limit, skip)`
Retrieves all orders for a specific user.

**Sample Input:**
```javascript
const orders = await orderRepository.findByUserId("507f1f77bcf86cd799439011", 10, 0);
```

**Sample Output:**
```javascript
[
  {
    _id: "507f1f77bcf86cd799439012",
    user: "507f1f77bcf86cd799439011",
    items: [...],
    totalAmount: 999.99,
    status: "pending"
  }
]
```

---

#### `findAll(limit, skip)`
Retrieves all orders with pagination.

**Sample Input:**
```javascript
const orders = await orderRepository.findAll(10, 0);
```

**Sample Output:**
```javascript
[
  {
    _id: "507f1f77bcf86cd799439012",
    user: { name: "John Doe", email: "john@example.com" },
    items: [...],
    totalAmount: 999.99,
    status: "pending"
  }
]
```

---

#### `findByStatus(status, limit, skip)`
Retrieves orders filtered by status.

**Sample Input:**
```javascript
const pendingOrders = await orderRepository.findByStatus("pending", 10, 0);
```

**Sample Output:**
```javascript
[
  {
    _id: "507f1f77bcf86cd799439012",
    status: "pending",
    totalAmount: 999.99
  }
]
```

---

#### `create(orderData)`
Creates a new order in the database.

**Sample Input:**
```javascript
const newOrder = await orderRepository.create({
  user: "507f1f77bcf86cd799439011",
  items: [
    { productName: "Laptop", quantity: 1, price: 999.99 }
  ],
  totalAmount: 999.99,
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  }
});
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  user: { name: "John Doe", email: "john@example.com" },
  items: [...],
  totalAmount: 999.99,
  status: "pending",
  shippingAddress: {...}
}
```

---

#### `update(id, updateData)`
Updates an existing order.

**Sample Input:**
```javascript
const updatedOrder = await orderRepository.update(
  "507f1f77bcf86cd799439012",
  { status: "shipped" }
);
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  status: "shipped",
  updatedAt: "2024-01-15T11:00:00.000Z"
}
```

---

#### `deleteOrder(id)`
Deletes an order from the database.

**Sample Input:**
```javascript
const deletedOrder = await orderRepository.deleteOrder("507f1f77bcf86cd799439012");
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  status: "pending",
  totalAmount: 999.99
}
```

## Usage Examples

### In Service Layer
```javascript
const userRepository = require('../repositories/userRepository');

// Find user by email
const user = await userRepository.findByEmail("john@example.com");

// Create new user
const newUser = await userRepository.create({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});

// Update user
const updated = await userRepository.update(userId, { name: "Jane Doe" });
```

### With Error Handling
```javascript
try {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
} catch (error) {
  console.error('Repository error:', error.message);
  throw error;
}
```

## Error Handling
All repository functions:
- Throw descriptive errors on failure
- Include original error message
- Return null for not found (find operations)
- Propagate validation errors from models

## Best Practices
- Always handle null returns from find operations
- Use try-catch blocks when calling repository functions
- Validate input before calling repository
- Use pagination for list operations
- Populate related documents when needed
- Keep repository functions focused on data access only

## Dependencies
- User model (from ../models/User)
- Order model (from ../models/Order)
- mongoose (via models)