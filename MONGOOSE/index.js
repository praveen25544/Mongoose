import express from "express";
import { connectDB, setupConnectionHandlers, closeConnection } from "./config/database.js";
import { SERVER } from "./config/constants.js";
import postsRouter from "./routes/posts.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
await connectDB();
setupConnectionHandlers();

// API Routes
app.use("/api/posts", postsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404 Not Found middleware
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(SERVER.PORT, () => {
  console.log(`✓ Server running on http://localhost:${SERVER.PORT}`);
  console.log(`✓ Environment: ${SERVER.NODE_ENV}`);
  console.log(`✓ API Routes: http://localhost:${SERVER.PORT}/api/posts`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await closeConnection();
  process.exit(0);
});