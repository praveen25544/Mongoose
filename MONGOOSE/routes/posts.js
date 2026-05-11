import express from "express";
import Post from "../Models/post.js";
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from "../config/constants.js";

/* ═══════════════════════════════════════════════════════════════════════════
   📝 POST ROUTES - CRUD OPERATIONS
   ═══════════════════════════════════════════════════════════════════════════
   
   This file defines all API endpoints for Posts.
   
   ROUTES:
   - POST   /posts           - Create new post
   - GET    /posts           - Get all posts (with pagination)
   - GET    /posts/:id       - Get single post
   - PUT    /posts/:id       - Update post
   - DELETE /posts/:id       - Delete post
   
   ═══════════════════════════════════════════════════════════════════════════
*/

const router = express.Router();

// CREATE - Add new post
router.post("/", async (req, res) => {
  try {
    // IMPORTANT: Input validation
    if (!req.body.title || !req.body.content) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.REQUIRED_FIELDS,
      });
    }

    // IMPORTANT: Create and save document
    const post = await Post.create(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    // IMPORTANT: Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.VALIDATION_FAILED,
        details: Object.values(err.errors).map((e) => e.message),
      });
    }
    // IMPORTANT: Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        error: ERROR_MESSAGES.DUPLICATE_KEY,
      });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: err.message });
  }
});

// READ - Get all posts with pagination
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, req.query.page || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      req.query.limit || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;

    // PRO TIP: Query chaining for optimization
    const posts = await Post.find()
      .select("title author createdAt status") // Projection - only needed fields
      .limit(limit) // Limit results
      .skip(skip) // Pagination offset
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // PRO TIP: lean() for read-only (better performance)

    const total = await Post.countDocuments();

    res.status(HTTP_STATUS.OK).json({
      data: posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: err.message });
  }
});

// READ - Get single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({ data: post });
  } catch (err) {
    // IMPORTANT: Handle invalid MongoDB ObjectId
    if (err.name === "CastError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.INVALID_ID,
      });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: err.message });
  }
});

// UPDATE - Update post by ID
router.put("/:id", async (req, res) => {
  try {
    // IMPORTANT: Return updated document
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    });

    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Post updated successfully",
      data: post,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.VALIDATION_FAILED,
        details: Object.values(err.errors).map((e) => e.message),
      });
    }
    if (err.name === "CastError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.INVALID_ID,
      });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: err.message });
  }
});

// DELETE - Delete post by ID
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Post deleted successfully",
      data: post,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.INVALID_ID,
      });
    }
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: err.message });
  }
});

export default router;
