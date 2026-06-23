# Services Folder

## Purpose
This folder contains the business logic layer that sits between GraphQL resolvers and data repositories. Services handle complex operations, validation, authorization, and orchestrate multiple repository calls.

## Architecture Pattern
The service layer provides:
- Business logic separation from data access
- Authorization and validation
- Complex operation orchestration
- Reusable business functions
- Transaction management

## Files

### userService.js
**Purpose:** Handles all business logic for user operations including authentication.

**What it does:**
- User registration with validation
- User authentication and JWT generation
- User profile management
- Authorization checks
- Password security

**Functions:**

#### `register(userData)`
Creates a new user account and returns JWT token.

**Sample Input:**
```javascript
const result = await userService.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});
```

**Sample Output:**
```javascript
{
  user: {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z"
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Business Logic:**
- Checks if email already exists
- Creates user via repository
- Generates JWT token
- Returns user and token

**Error Handling:**
- Throws "Email already registered" if duplicate
- Throws "Registration failed" with details

---

#### `login(email, password)`
Authenticates user and returns JWT token.

**Sample Input:**
```javascript
const result = await userService.login(
  "john@example.com",
  "password123"
);
```

**Sample Output:**
```javascript
{
  user: {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com"
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Business Logic:**
- Finds user by email (with password)
- Verifies password using bcrypt
- Generates JWT token
- Returns user without password

**Error Handling:**
- Throws "Invalid email or password" if not found or wrong password

---

#### `getUserById(id)`
Retrieves user information by ID.

**Sample Input:**
```javascript
const user = await userService.getUserById("507f1f77bcf86cd799439011");
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com"
}
```

**Error Handling:**
- Throws "User not found" if user doesn't exist

---

#### `getAllUsers(limit, skip)`
Retrieves all users with pagination.

**Sample Input:**
```javascript
const users = await userService.getAllUsers(10, 0);
```

**Sample Output:**
```javascript
[
  { _id: "...", name: "John Doe", email: "john@example.com" },
  { _id: "...", name: "Jane Smith", email: "jane@example.com" }
]
```

---

#### `updateUser(id, updateData, requestUserId)`
Updates user information with authorization check.

**Sample Input:**
```javascript
const updated = await userService.updateUser(
  "507f1f77bcf86cd799439011",
  { name: "Jane Doe" },
  "507f1f77bcf86cd799439011" // Must match id
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

**Business Logic:**
- Verifies user can only update their own profile
- Removes password from update data (security)
- Updates via repository

**Error Handling:**
- Throws "Unauthorized" if requestUserId doesn't match id
- Throws "User not found" if user doesn't exist

---

#### `deleteUser(id, requestUserId)`
Deletes user account with authorization check.

**Sample Input:**
```javascript
const deleted = await userService.deleteUser(
  "507f1f77bcf86cd799439011",
  "507f1f77bcf86cd799439011" // Must match id
);
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com"
}
```

**Business Logic:**
- Verifies user can only delete their own account
- Deletes via repository

**Error Handling:**
- Throws "Unauthorized" if requestUserId doesn't match id
- Throws "User not found" if user doesn't exist

---

### orderService.js
**Purpose:** Handles all business logic for order operations.

**What it does:**
- Order creation with validation
- Order management and status updates
- Authorization checks for order access
- Order cancellation logic
- Order filtering and retrieval

**Functions:**

#### `createOrder(orderData, userId)`
Creates a new order for authenticated user.

**Sample Input:**
```javascript
const order = await orderService.createOrder(
  {
    items: [
      { productName: "Laptop", quantity: 1, price: 999.99 }
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    }
  },
  "507f1f77bcf86cd799439011"
);
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
  items: [...],
  totalAmount: 999.99,
  status: "pending",
  shippingAddress: {...}
}
```

**Business Logic:**
- Verifies user exists
- Validates items array not empty
- Calculates total amount from items
- Creates order via repository

**Error Handling:**
- Throws "User not found" if user doesn't exist
- Throws "Order must contain at least one item" if no items

---

#### `getOrderById(id, userId)`
Retrieves order by ID with authorization check.

**Sample Input:**
```javascript
const order = await orderService.getOrderById(
  "507f1f77bcf86cd799439012",
  "507f1f77bcf86cd799439011"
);
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  user: { ... },
  items: [...],
  totalAmount: 999.99,
  status: "pending"
}
```

**Business Logic:**
- Retrieves order via repository
- Verifies user owns the order

**Error Handling:**
- Throws "Order not found" if order doesn't exist
- Throws "Unauthorized" if user doesn't own order

---

#### `getUserOrders(userId, limit, skip)`
Retrieves all orders for a specific user.

**Sample Input:**
```javascript
const orders = await orderService.getUserOrders(
  "507f1f77bcf86cd799439011",
  10,
  0
);
```

**Sample Output:**
```javascript
[
  {
    _id: "507f1f77bcf86cd799439012",
    items: [...],
    totalAmount: 999.99,
    status: "pending"
  }
]
```

---

#### `getAllOrders(limit, skip)`
Retrieves all orders (admin function).

**Sample Input:**
```javascript
const orders = await orderService.getAllOrders(10, 0);
```

**Sample Output:**
```javascript
[
  {
    _id: "507f1f77bcf86cd799439012",
    user: { name: "John Doe", email: "john@example.com" },
    totalAmount: 999.99,
    status: "pending"
  }
]
```

---

#### `getOrdersByStatus(status, limit, skip)`
Retrieves orders filtered by status.

**Sample Input:**
```javascript
const orders = await orderService.getOrdersByStatus("pending", 10, 0);
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

**Business Logic:**
- Validates status is valid enum value
- Retrieves filtered orders via repository

**Error Handling:**
- Throws "Invalid status" if status not in allowed values

---

#### `updateOrderStatus(id, status, userId)`
Updates order status with authorization check.

**Sample Input:**
```javascript
const updated = await orderService.updateOrderStatus(
  "507f1f77bcf86cd799439012",
  "shipped",
  "507f1f77bcf86cd799439011"
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

**Business Logic:**
- Retrieves order and verifies ownership
- Validates status is valid enum value
- Updates via repository

**Error Handling:**
- Throws "Order not found" if order doesn't exist
- Throws "Unauthorized" if user doesn't own order
- Throws "Invalid status" if status not valid

---

#### `cancelOrder(id, userId)`
Cancels an order with business rules.

**Sample Input:**
```javascript
const cancelled = await orderService.cancelOrder(
  "507f1f77bcf86cd799439012",
  "507f1f77bcf86cd799439011"
);
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  status: "cancelled",
  updatedAt: "2024-01-15T11:00:00.000Z"
}
```

**Business Logic:**
- Verifies user owns order
- Checks order can be cancelled (not shipped/delivered)
- Checks order not already cancelled
- Updates status to cancelled

**Error Handling:**
- Throws "Order not found" if order doesn't exist
- Throws "Unauthorized" if user doesn't own order
- Throws "Cannot cancel order that has been shipped or delivered"
- Throws "Order is already cancelled"

---

#### `deleteOrder(id)`
Deletes an order (admin function).

**Sample Input:**
```javascript
const deleted = await orderService.deleteOrder("507f1f77bcf86cd799439012");
```

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  status: "pending",
  totalAmount: 999.99
}
```

**Error Handling:**
- Throws "Order not found" if order doesn't exist

## Usage Examples

### In GraphQL Resolver
```javascript
const userService = require('../services/userService');
const { requireAuth } = require('../middleware/auth');

const resolver = async (args, context) => {
  const user = requireAuth(context);
  return await userService.getUserById(user.userId);
};
```

### With Error Handling
```javascript
try {
  const result = await userService.login(email, password);
  return result;
} catch (error) {
  console.error('Login failed:', error.message);
  throw error;
}
```

## Business Rules

### User Service
- Users can only update/delete their own accounts
- Email must be unique
- Password automatically hashed
- JWT tokens expire after 7 days (configurable)

### Order Service
- Users can only view/update their own orders
- Orders must have at least one item
- Total amount calculated automatically
- Orders can only be cancelled if not shipped/delivered
- Valid statuses: pending, processing, shipped, delivered, cancelled

## Dependencies
- userRepository (data access)
- orderRepository (data access)
- auth middleware (JWT generation)

## Best Practices
- Always validate input before repository calls
- Check authorization before operations
- Use descriptive error messages
- Keep business logic in services, not resolvers
- Handle all edge cases
- Use transactions for complex operations