import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";

/* ═══════════════════════════════════════════════════════════════════════════
   🚨 ERROR HANDLING MIDDLEWARE
   ═══════════════════════════════════════════════════════════════════════════
   
   This file contains centralized error handling for the application.
   
   ERROR TYPES:
   - ValidationError - Schema validation failed
   - CastError - Invalid ObjectId or type mismatch
   - DuplicateKeyError (11000) - Unique constraint violated
   - 404 - Route not found
   - Generic server errors
   
   ═══════════════════════════════════════════════════════════════════════════
*/

// IMPORTANT: Centralized error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.VALIDATION_FAILED,
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose Cast Error (Invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.INVALID_ID,
      field: err.path,
    });
  }

  // Duplicate Key Error (Unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(HTTP_STATUS.CONFLICT).json({
      error: `${field} must be unique`,
      field,
    });
  }

  // JWT Errors (if implementing authentication)
  if (err.name === "JsonWebTokenError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Invalid token",
    });
  }

  // Default server error
  res.status(err.statusCode || HTTP_STATUS.SERVER_ERROR).json({
    error: err.message || ERROR_MESSAGES.SERVER_ERROR,
  });
};

// IMPORTANT: 404 Not Found middleware
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: `Route ${req.originalUrl} not found`,
  });
};

// Async error wrapper - Wraps async route handlers to catch errors
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
