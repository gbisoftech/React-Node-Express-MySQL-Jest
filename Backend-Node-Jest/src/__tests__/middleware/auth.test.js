const jwt = require('jsonwebtoken');
const { protect } = require('../../middleware/auth');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should fail if no token is provided', async () => {
    await protect(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
  });

  it('should fail if invalid token is provided', async () => {
    mockReq.headers.authorization = 'Bearer invalid_token';
    await protect(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
  });

  it('should pass if valid token is provided', async () => {
    const userId = 1;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test_secret');
    mockReq.headers.authorization = `Bearer ${token}`;
    
    await protect(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user.id).toEqual(userId);
  });

  it('should fail if token is malformed', async () => {
    mockReq.headers.authorization = 'Invalid_format';
    await protect(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
  });
}); 