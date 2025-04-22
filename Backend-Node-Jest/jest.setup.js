// Set test environment
process.env.NODE_ENV = 'test';

// Set test database configuration
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = '';
process.env.DB_HOST = 'localhost';
process.env.JWT_SECRET = 'test_secret';

// Increase timeout for database operations
jest.setTimeout(30000); 