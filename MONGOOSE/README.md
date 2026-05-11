# 🚀 Mongoose MongoDB API - Project Structure

A well-organized Node.js + Express + MongoDB application with comprehensive Mongoose learning materials.

## 📁 Project Structure

```
MONGOOSE/
├── 📄 index.js                    # Main server file
├── 📄 package.json                # Dependencies
├── 📁 config/                     # Configuration files
│   ├── database.js                # MongoDB connection setup
│   └── constants.js               # App constants & configs
├── 📁 Models/                     # Mongoose Schemas
│   └── post.js                    # Post schema with validation
├── 📁 routes/                     # API endpoints
│   └── posts.js                   # Post CRUD routes (with full learning notes)
├── 📁 middleware/                 # Express middleware
│   └── errorHandler.js            # Centralized error handling
└── 📁 utils/                      # Utility functions
    └── queryExamples.js           # Advanced Mongoose query patterns
```

## 🗂️ File Descriptions

### 📄 `config/database.js`
Handles MongoDB connection with:
- Connection pooling configuration
- Event handlers (connected, disconnected, error)
- Graceful shutdown
- Connection retry logic

**Key Concepts:**
- `useNewUrlParser` & `useUnifiedTopology` - Modern MongoDB driver options
- `maxPoolSize` & `minPoolSize` - Connection pooling
- Timeout management - Prevent hanging operations

### 📄 `config/constants.js`
Centralized configuration management:
- Server settings (PORT, HOST, NODE_ENV)
- Database configuration
- HTTP status codes
- Error messages
- Pagination defaults
- Validation rules

**Usage:** Import constants instead of hardcoding values

### 📄 `routes/posts.js`
Complete CRUD API endpoints with:
- **POST** `/api/posts` - Create post
- **GET** `/api/posts` - Get all posts (with pagination)
- **GET** `/api/posts/:id` - Get single post
- **PUT** `/api/posts/:id` - Update post
- **DELETE** `/api/posts/:id` - Delete post

**Includes:** Full error handling, validation, pagination, projection

### 📄 `Models/post.js`
Mongoose schema definition with:
- Field validation (required, min/max length, enum)
- Field normalization (trim, lowercase)
- Indexes for performance
- Schema options (timestamps, strict mode)

**Learning Sections:** Schema basics, field properties, validation rules

### 📄 `middleware/errorHandler.js`
Centralized error handling for:
- ValidationError - Schema validation failed
- CastError - Invalid ObjectId
- DuplicateKeyError (11000) - Unique constraint
- 404 Not Found
- Generic server errors

### 📄 `utils/queryExamples.js`
Advanced Mongoose patterns (commented examples):
1. `.lean()` - Performance optimization
2. Projection - Select only needed fields
3. Query chaining - Complex queries
4. `.populate()` - Relationships
5. Aggregation pipeline
6. Bulk operations
7. Indexing strategies
8. `.distinct()` - Unique values
9. Count operations
10. Update operators ($inc, $push, etc.)
11. Conditional updates
12. Batch processing

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Start Server
```bash
npm start
```

Server runs on `http://localhost:3000`

### Available Endpoints

```bash
# Health check
GET /health

# Posts API
POST   /api/posts              # Create post
GET    /api/posts              # Get all posts
GET    /api/posts/:id          # Get single post
PUT    /api/posts/:id          # Update post
DELETE /api/posts/:id          # Delete post
```

## 📚 Learning Path

### Basics (Start Here)
1. Read `config/database.js` - Understand connection setup
2. Read `Models/post.js` - Schema definition and validation
3. Read `routes/posts.js` - Basic CRUD operations

### Intermediate
1. Study error handling in `middleware/errorHandler.js`
2. Review pagination & projection in `routes/posts.js`
3. Check HTTP status codes in `config/constants.js`

### Advanced
1. Uncomment examples in `utils/queryExamples.js`
2. Implement advanced patterns in your routes
3. Add custom indexes and middleware

## 🔑 Key Mongoose Concepts

### Connection Options
```javascript
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
```

### Schema Validation
```javascript
title: {
  type: String,
  required: [true, "Custom error message"],
  trim: true,
  minlength: 5,
  maxlength: 100
}
```

### Query Optimization
```javascript
Post.find()
  .select('title author')      // Projection
  .limit(10)                   // Limit results
  .skip(0)                     // Pagination
  .sort({ createdAt: -1 })     // Sorting
  .lean()                      // Performance
```

### Error Handling
```javascript
try {
  const post = await Post.create(data);
} catch (err) {
  if (err.name === "ValidationError") { }
  if (err.code === 11000) { }           // Duplicate
  if (err.name === "CastError") { }     // Invalid ID
}
```

## 📝 API Examples

### Create Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my content",
    "author": "john",
    "status": "published"
  }'
```

### Get All Posts (with pagination)
```bash
curl http://localhost:3000/api/posts?page=1&limit=10
```

### Get Single Post
```bash
curl http://localhost:3000/api/posts/[POST_ID]
```

### Update Post
```bash
curl -X PUT http://localhost:3000/api/posts/[POST_ID] \
  -H "Content-Type: application/json" \
  -d '{ "status": "archived" }'
```

### Delete Post
```bash
curl -X DELETE http://localhost:3000/api/posts/[POST_ID]
```

## ✅ Best Practices Implemented

✓ Centralized database connection
✓ Connection pooling & timeout management
✓ Schema validation with custom messages
✓ Comprehensive error handling
✓ HTTP status codes consistency
✓ Pagination for large datasets
✓ Query projection for performance
✓ Graceful shutdown
✓ Environment-based configuration
✓ Code organization by topic

## 🎓 Mongoose Learning Resources

- **Basics:** Connection, Schema, Model, CRUD
- **Intermediate:** Validation, Middleware, Error Handling
- **Advanced:** Aggregation, Populate, Virtuals, Plugins

All explanations and examples are included in the code comments!

## 📦 Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM

## 🔧 Environment Variables

Create `.env` file:
```
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/testDB
NODE_ENV=development
```

## 📞 Support

Refer to inline comments in each file for detailed explanations of Mongoose concepts and patterns!
