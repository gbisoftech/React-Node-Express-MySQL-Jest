const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for development
  console.log(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = err.message;
    error = { message, statusCode: 400 };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Not authorized';
    error = { message, statusCode: 401 };
  }

  // Default error
  res.status(error.statusCode || 500).json({
    message: error.message || 'Server Error'
  });
};

module.exports = { errorHandler }; 