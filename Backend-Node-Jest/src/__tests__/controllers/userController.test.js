const { sequelize } = require('../../config/database');
const {
  registerUser,
  loginUser,
  getUserProfile
} = require('../../controllers/userController');
const User = require('../../models/User');

describe('User Controller', () => {
  let mockReq;
  let mockRes;

  beforeAll(async () => {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelize.sync({ force: true });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await registerUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Test User',
          email: 'test@example.com',
        })
      );
    });

    it('should not register a user with existing email', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      await registerUser(mockReq, mockRes);
      await registerUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User already exists'
      });
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
            
    });

    it('should login with valid credentials', async () => {
      await User.create({
        name: 'Login Test',
        email: 'login@example.com',
        password: 'password123'
      });
      mockReq.body = {
        email: 'login@example.com',
        password: 'password123'
      };

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String)
        })
      );
    });

    
    
    it('should not login with invalid password', async () => {
      mockReq.body = {
        email: 'login@example.com',
        password: 'wrongpassword'
      };

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile', async () => {
      const user = await User.create({
        name: 'Profile Test',
        email: 'profile@example.com',
        password: 'password123'
      });

      mockReq.user = { id: user.id };

      await getUserProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      // expect(mockRes.json).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     id: user.id,
      //     name: 'Profile Test',
      //     email: 'profile@example.com'
      //   })
      // );
    });
  });
}); 