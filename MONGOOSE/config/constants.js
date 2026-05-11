/* ═══════════════════════════════════════════════════════════════════════════
   🔧 APPLICATION CONSTANTS & CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════
   
   This file stores all magic values and configuration constants.
   Centralize constants to make them easy to update and maintain.
   
   ═══════════════════════════════════════════════════════════════════════════
*/

// Server Configuration
export const SERVER = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "127.0.0.1",
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Database Configuration
export const DATABASE = {
  URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/testDB",
  NAME: "testDB",
  COLLECTIONS: {
    POSTS: "posts",
    USERS: "users",
    COMMENTS: "comments",
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION_FAILED: "Validation failed",
  REQUIRED_FIELDS: "Title and content are required",
  DUPLICATE_KEY: "Duplicate field value",
  NOT_FOUND: "Document not found",
  SERVER_ERROR: "Internal server error",
  INVALID_ID: "Invalid document ID",
};

// Post Status Enum
export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Validation Rules
export const VALIDATION = {
  TITLE_MIN: 5,
  TITLE_MAX: 100,
  CONTENT_MIN: 10,
  CONTENT_MAX: 5000,
  AUTHOR_MIN: 2,
  AUTHOR_MAX: 50,
};

export default {
  SERVER,
  DATABASE,
  HTTP_STATUS,
  ERROR_MESSAGES,
  POST_STATUS,
  PAGINATION,
  VALIDATION,
};
