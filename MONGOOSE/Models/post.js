import mongoose from "mongoose";

/* ═══════════════════════════════════════════════════════════════════════════
   📚 MONGOOSE SCHEMA BASICS
   ═══════════════════════════════════════════════════════════════════════════
   
   SCHEMA TYPES:
   - String, Number, Boolean, Date, ObjectId, Array, Mixed
   - Each field has: type, required, default, validate, custom options
   
   FIELD PROPERTIES:
   - type: Data type
   - required: [true, 'Error message'] - Must have value
   - default: Value if not provided
   - trim: Remove whitespace (String only)
   - lowercase/uppercase: Transform case (String only)
   - enum: Allowed values only
   - minlength/maxlength: String length (String)
   - min/max: Number range (Number)
   - validate: Custom validation function
   - unique: No duplicate values (creates index)
   - sparse: Allow null if unique
   - index: Create database index for faster queries
   
   ═══════════════════════════════════════════════════════════════════════════
*/

const postSchema = new mongoose.Schema({
  // IMPORTANT: Use required: true for mandatory fields
  title: {
    type: String,
    required: [true, "Title is required"],  // IMPORTANT: Custom error message
    trim: true,                             // IMPORTANT: Remove leading/trailing spaces
    maxlength: [100, "Title max length is 100 chars"]
  },
  
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    minlength: [10, "Content must be at least 10 chars"]
  },
  
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
    lowercase: true  // IMPORTANT: Normalize to lowercase
  },
  
  status: {
    type: String,
    // IMPORTANT: Use enum for fixed set of values
    enum: ["draft", "published", "archived"],
    default: "draft",  // IMPORTANT: Set sensible defaults
    lowercase: true
  },
  
  // IMPORTANT: Add these meta fields for better tracking
  views: {
    type: Number,
    default: 0
  },
  
  tags: {
    type: [String],  // IMPORTANT: Use array for multiple values
    default: []
  }
  
}, { 
  timestamps: true,  // IMPORTANT: Automatically adds createdAt & updatedAt fields
  strict: true       // IMPORTANT: Ignore fields not in schema
});

/* ═══════════════════════════════════════════════════════════════════════════
   🚀 MONGOOSE SCHEMA PRO TIPS
   ═══════════════════════════════════════════════════════════════════════════
   
   1. SCHEMA OPTIONS:
      - timestamps: true - Adds createdAt, updatedAt
      - strict: true - Ignore unknown fields
      - virtuals: true - Include virtual properties in toJSON
      - minimize: true - Remove empty objects
      - versionKey: '__v' or false - Document versioning
   
   2. INDEXES FOR PERFORMANCE:
      - Single field: schema.index({ field: 1 })
      - Compound: schema.index({ field1: 1, field2: -1 })
      - 1 = ascending, -1 = descending
      - Use on: frequently queried fields, sort fields, foreign keys
   
   3. VALIDATORS:
      - Built-in: required, enum, min, max, match (regex)
      - Custom: validate: { validator: function, message: 'msg' }
      - Async: Works in save/validate, not in findByIdAndUpdate
   
   4. MIDDLEWARE (HOOKS):
      - pre('save') - Validate, hash password, set defaults
      - pre('find'/'findOne') - Add conditions, limit fields
      - post('save') - Logging, notifications
      - Use: schema.pre('save', function() { ... })
   
   5. VIRTUALS - Computed fields NOT stored in DB:
      schema.virtual('fullName').get(function() {
        return this.firstName + ' ' + this.lastName;
      });
   
   6. INSTANCE METHODS:
      postSchema.methods.markAsPublished = function() {
        this.status = 'published';
        return this.save();
      };
      Usage: post.markAsPublished();
   
   7. STATIC METHODS:
      postSchema.statics.findByAuthor = function(author) {
        return this.find({ author });
      };
      Usage: Post.findByAuthor('John');
   
   ═══════════════════════════════════════════════════════════════════════════
*/


// IMPORTANT: Create indexes on frequently queried fields (improves performance)
postSchema.index({ author: 1 });      // Search by author
postSchema.index({ status: 1 });      // Filter by status
postSchema.index({ createdAt: -1 });  // Sort by creation date

// IMPORTANT: Prevent duplicate model compilation
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;