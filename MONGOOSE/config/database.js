import mongoose from "mongoose";

/* ═══════════════════════════════════════════════════════════════════════════
   📚 DATABASE CONNECTION CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════
   
   This file handles all MongoDB connection setup and lifecycle management.
   
   KEY CONCEPTS:
   - Connection pooling: Multiple requests share database connections
   - Retry logic: Automatic reconnection on disconnection
   - Event handling: Monitor connection state
   - Timeout management: Prevent hanging operations
   
   ═══════════════════════════════════════════════════════════════════════════
*/

// IMPORTANT: Connection configuration with essential options
const mongooseOptions = {
  useNewUrlParser: true,           // IMPORTANT: Parse connection string correctly
  useUnifiedTopology: true,        // IMPORTANT: Use new connection management
  maxPoolSize: 10,                 // IMPORTANT: Max connections from app to DB
  minPoolSize: 2,                  // IMPORTANT: Minimum idle connections
  serverSelectionTimeoutMS: 5000,  // IMPORTANT: Time to find server
  socketTimeoutMS: 45000,          // IMPORTANT: Time for operations to complete
  retryWrites: true,               // IMPORTANT: Auto-retry writes
  w: "majority",                   // IMPORTANT: Wait for majority replica confirmation
};

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB", mongooseOptions);
    console.log("✓ MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    console.error("✗ MongoDB Connection Failed:", err.message);
    process.exit(1); // IMPORTANT: Exit on connection failure
  }
};

// IMPORTANT: Handle connection events
export const setupConnectionHandlers = () => {
  mongoose.connection.on("connected", () => {
    console.log("✓ Mongoose connected to MongoDB");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ Mongoose disconnected from DB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("✗ Mongoose connection error:", err.message);
  });

  mongoose.connection.on("reconnected", () => {
    console.log("✓ Mongoose reconnected to MongoDB");
  });
};

// Graceful shutdown
export const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("✓ MongoDB connection closed");
  } catch (err) {
    console.error("✗ Error closing connection:", err.message);
  }
};

export default { connectDB, setupConnectionHandlers, closeConnection };
