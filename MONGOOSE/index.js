import express from "express";
import mongoose from "mongoose";
import Post from "./Models/post.js"; // IMPORTANT: Model import path

const app = express();
app.use(express.json());

/* ═══════════════════════════════════════════════════════════════════════════
   📚 MONGOOSE BASICS - MUST KNOW CONCEPTS
   ═══════════════════════════════════════════════════════════════════════════
   
   1. CONNECTION:
      - mongoose.connect(url, options) - Connect to MongoDB
      - Connection pooling - Multiple requests share connections
      - Retry logic - Auto-reconnects on disconnection
   
   2. SCHEMA:
      - Defines document structure (fields, types, validation)
      - Blueprint for data in MongoDB
      - Can have methods, statics, and virtual properties
   
   3. MODEL:
      - Created from Schema
      - Used to interact with database (CRUD operations)
      - Model.create(), Model.find(), Model.updateOne(), Model.deleteOne()
   
   4. BASIC OPERATIONS (CRUD):
      - CREATE: Model.create() or new Model().save()
      - READ: Model.find(), Model.findById(), Model.findOne()
      - UPDATE: Model.updateOne(), Model.updateMany(), Model.findByIdAndUpdate()
      - DELETE: Model.deleteOne(), Model.deleteMany(), Model.findByIdAndDelete()
   
   ═══════════════════════════════════════════════════════════════════════════
*/

/* ═══════════════════════════════════════════════════════════════════════════
   🚀 MONGOOSE PRO TIPS - ADVANCED PATTERNS
   ═══════════════════════════════════════════════════════════════════════════
   
   1. PERFORMANCE OPTIMIZATION:
      - Use .lean() for read-only queries (no Document wrapper overhead)
      - Create indexes on frequently queried fields
      - Use projection to select only needed fields: find({}, 'field1 field2')
      - Batch operations instead of looping queries
      - Use connection pooling (maxPoolSize)
   
   2. ERROR HANDLING PATTERNS:
      - ValidationError - Schema validation failed
      - CastError - Invalid ObjectId or type mismatch
      - DuplicateKeyError (11000) - Unique constraint violation
      - Always wrap async/await in try-catch
   
   3. MIDDLEWARE & HOOKS:
      - pre('save') - Run before document save
      - post('save') - Run after document save
      - pre('find') - Run before query execution
      - Use for: validation, encryption, logging, auto-calculation
   
   4. QUERY OPTIMIZATION:
      - populate() - Fetch related documents (like JOIN)
      - select() - Choose specific fields
      - limit() - Limit results count
      - skip() - Pagination offset
      - sort() - Order results
      - Chain: Post.find().select('title author').limit(10).sort({createdAt: -1})
   
   5. SCHEMA ADVANCED:
      - Virtuals - Computed fields not stored in DB
      - Methods - Functions on documents
      - Statics - Functions on Model
      - Plugins - Reusable schema features
   
   ═══════════════════════════════════════════════════════════════════════════
*/

// 1. Always set connection options to avoid deprecation warnings
// 2. Use proper error handling for database operations
// 3. Set server-level timeouts and reconnection strategies
// 4. Use connection pooling for better performance

// MongoDB connect with important options
mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
  useNewUrlParser: true,           // IMPORTANT: Parse connection string correctly
  useUnifiedTopology: true,        // IMPORTANT: Use new connection management
  maxPoolSize: 10,                 // IMPORTANT: Connection pool size for production
  minPoolSize: 2,                  // IMPORTANT: Minimum connections
  serverSelectionTimeoutMS: 5000,  // IMPORTANT: Timeout for server selection
  socketTimeoutMS: 45000,          // IMPORTANT: Timeout for operations
})
  .then(() => console.log("✓ DB connected successfully"))
  .catch(err => {
    console.error("✗ DB Connection Failed:", err.message);
    process.exit(1); // IMPORTANT: Exit on connection failure
  });

// IMPORTANT: Handle connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected from DB");
});
mongoose.connection.on("error", (err) => {
  console.error("✗ Mongoose connection error:", err);
});

// IMPORTANT: Always validate input data before database operations
// Test API (post create)
app.post("/create", async (req, res) => {
  try {
    // IMPORTANT: Input validation (should use middleware like Joi/Zod in production)
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // IMPORTANT: Use try-catch for async database operations
    const data = await Post.create(req.body);
    
    // IMPORTANT: Always return proper HTTP status codes
    res.status(201).json(data);
  } catch (err) {
    // IMPORTANT: Handle validation errors and duplicate key errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation failed", details: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate field value" });
    }
    res.status(500).json({ error: err.message });
  }
});

// EXAMPLE PRO TIP: Using populate() for relationships
// app.get("/posts/:id/author", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id)
//       .populate('author') // If author was ObjectId reference
//       .select('title author'); // Projection - only get these fields
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// EXAMPLE PRO TIP: Query optimization with chaining
// app.get("/posts", async (req, res) => {
//   try {
//     const page = req.query.page || 1;
//     const limit = 10;
//     const skip = (page - 1) * limit;
//     
//     const posts = await Post.find()
//       .select('title author createdAt status') // Projection
//       .limit(limit)           // Limit results
//       .skip(skip)             // Pagination offset
//       .sort({ createdAt: -1 }) // Newest first
//       .lean();                 // PRO TIP: lean() for read-only (faster)
//     
//     const total = await Post.countDocuments();
//     res.json({ posts, total, pages: Math.ceil(total / limit) });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// IMPORTANT: Always include error handling in async operations
// Test API (get all posts)
app.get("/posts", async (req, res) => {
  try {
    // IMPORTANT: Use lean() for read-only operations (better performance)
    const data = await Post.find().lean();
    
    // IMPORTANT: Add pagination for large datasets
    // .limit(10).skip(0) can be added here
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EXAMPLE PRO TIP: Bulk operations
// app.post("/bulk-create", async (req, res) => {
//   try {
//     const posts = await Post.insertMany(req.body); // Insert multiple at once
//     res.status(201).json({ count: posts.length, posts });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// EXAMPLE PRO TIP: Aggregation pipeline
// app.get("/stats", async (req, res) => {
//   try {
//     const stats = await Post.aggregate([
//       { $group: { _id: '$author', count: { $sum: 1 }, posts: { $push: '$title' } } },
//       { $sort: { count: -1 } }
//     ]);
//     res.json(stats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.listen(3000, () => {
  console.log("✓ Server running on http://localhost:3000");
  // IMPORTANT: In production, use environment variables for port
  // const PORT = process.env.PORT || 3000;
});

// IMPORTANT: Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});