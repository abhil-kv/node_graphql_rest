# Middleware Folder

## Purpose
This folder contains middleware functions that process requests before they reach the GraphQL resolvers. Middleware handles cross-cutting concerns like authentication, authorization, and request validation.

## Files

### auth.js
**Purpose:** Handles JWT-based authentication and authorization for the application.

**What it does:**
- Validates JWT tokens from request headers
- Attaches user information to request context
- Provides authentication requirement checks
- Generates JWT tokens for authenticated users

**Functions:**

#### `authMiddleware(req, res, next)`
Express middleware that validates JWT tokens and attaches user info to request.

**Sample Input:**
```javascript
// HTTP Request Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Sample Output:**
```javascript
// Attached to req object:
req.user = {
  userId: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  iat: 1234567890,
  exp: 1234567890
}
req.isAuthenticated = true
```

**Error Handling:**
- Sets `req.isAuthenticated = false` if token is invalid or missing
- Does not throw errors (allows request to continue)
- Resolver functions check authentication status

---

#### `requireAuth(context)`
Validates that user is authenticated before allowing access to resolver.

**Sample Input:**
```javascript
const context = {
  user: { userId: "123", email: "user@example.com" },
  isAuthenticated: true
};
const user = requireAuth(context);
```

**Sample Output:**
```javascript
{
  userId: "123",
  email: "user@example.com"
}
```

**Error Handling:**
- Throws error if user is not authenticated
- Error message: "Authentication required. Please login."

---

#### `generateToken(payload)`
Creates a JWT token for authenticated user.

**Sample Input:**
```javascript
const payload = {
  userId: "507f1f77bcf86cd799439011",
  email: "user@example.com"
};
const token = generateToken(payload);
```

**Sample Output:**
```javascript
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTYzNTE3MjY5MH0.abc123..."
```

**Token Properties:**
- Algorithm: HS256
- Expiration: 7 days (configurable via JWT_EXPIRES_IN)
- Payload includes: userId, email, iat (issued at), exp (expiration)

## Usage Examples

### In Express Server
```javascript
const { authMiddleware } = require('./middleware/auth');

app.use(authMiddleware); // Apply to all routes
```

### In GraphQL Resolver
```javascript
const { requireAuth } = require('../middleware/auth');

const resolver = async (args, context) => {
  const user = requireAuth(context); // Throws if not authenticated
  // Continue with authenticated logic
  return await someService(user.userId);
};
```

### Generating Token After Login
```javascript
const { generateToken } = require('../middleware/auth');

const login = async (email, password) => {
  const user = await authenticateUser(email, password);
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email
  });
  return { user, token };
};
```

## Environment Variables Required
- `JWT_SECRET`: Secret key for signing JWT tokens (required)
- `JWT_EXPIRES_IN`: Token expiration time (default: "7d")

## Dependencies
- jsonwebtoken: JWT token generation and verification

## Security Notes
- Always use HTTPS in production
- Keep JWT_SECRET secure and never commit to version control
- Tokens are stateless - cannot be revoked without additional logic
- Consider implementing token refresh mechanism for production
- Validate token expiration on every request