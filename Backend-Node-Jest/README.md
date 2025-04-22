# Node.js Backend Template

A secure and scalable Node.js backend template with JWT authentication and user management.

## Features

- JWT Authentication
- User Management (Register, Login, Profile)
- MySQL Integration
- Role-based Authorization
- Error Handling
- Security Middleware (Helmet, CORS)
- Environment Configuration

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # User and article models
├── routes/         # Route definitions
└── server.js       # Entry point
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/node-backend
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Helmet for security headers
- CORS protection
- Input validation
- Error handling middleware

## Dependencies

- express: Web framework
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- dotenv: Environment variables
- helmet: Security headers
- cors: Cross-Origin Resource Sharing
- morgan: HTTP request logging
