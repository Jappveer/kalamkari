class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
  
    // Mongoose Bad ObjectId Error
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid: ${err.path}`;
      err = new ErrorHandler(message, 400);
    }
  
    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map(value => value.message)
        .join(', ');
      err = new ErrorHandler(message, 400);
    }
  
    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      err = new ErrorHandler(message, 400);
    }
  
    res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  };
  
  module.exports = {
    ErrorHandler,
    errorMiddleware
  };