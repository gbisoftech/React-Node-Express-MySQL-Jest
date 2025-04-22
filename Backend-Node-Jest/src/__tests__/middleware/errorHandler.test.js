const { errorHandler } = require('../../middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should handle validation error', () => {
    const err = new Error('Validation failed');
    err.name = 'ValidationError';
    
    errorHandler(err, mockReq, mockRes, nextFunction);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Validation failed'
    });
  });

  it('should handle JWT error', () => {
    const err = new Error('jwt malformed');
    err.name = 'JsonWebTokenError';
    
    errorHandler(err, mockReq, mockRes, nextFunction);
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Not authorized'
    });
  });

  it('should handle generic error', () => {
    const err = new Error('Server Error');
    
    errorHandler(err, mockReq, mockRes, nextFunction);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Server Error'
    });
  });

  it('should handle error with custom status code', () => {
    const err = new Error('Custom Error');
    err.statusCode = 403;
    
    errorHandler(err, mockReq, mockRes, nextFunction);
    
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Custom Error'
    });
  });
}); 