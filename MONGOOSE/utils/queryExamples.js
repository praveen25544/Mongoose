import Post from "../Models/post.js";

/* ═══════════════════════════════════════════════════════════════════════════
   🚀 MONGOOSE QUERY EXAMPLES & PRO TIPS
   ═══════════════════════════════════════════════════════════════════════════
   
   This file contains advanced Mongoose query patterns and examples.
   Uncomment examples to use them in your routes.
   
   ═══════════════════════════════════════════════════════════════════════════
*/

// PRO TIP 1: Use lean() for read-only queries (better performance)
// ✓ Returns plain JavaScript objects instead of Mongoose documents
// ✓ Faster execution (no Document wrapper overhead)
// ✗ Cannot use document methods
// Usage: Use for GET requests where you won't modify data
/*
export const getPostsLean = async () => {
  return await Post.find().lean();
};
*/

// PRO TIP 2: Projection - Select only needed fields
// ✓ Reduces data transfer
// ✓ Improves query performance
// Syntax: .select('field1 field2 -field3')
// - means exclude that field
/*
export const getPostsSummary = async () => {
  return await Post.find()
    .select('title author createdAt -_id')
    .lean();
};
*/

// PRO TIP 3: Query chaining for complex queries
// ✓ Readable and maintainable
// ✓ MongoDB efficient
// Chain: find().select().where().limit().skip().sort().lean()
/*
export const getAdvancedPosts = async (status, author, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Post.find({ status, author })
    .select('title author status createdAt')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .lean();
};
*/

// PRO TIP 4: Populate - Fetch related documents (like JOIN in SQL)
// ✓ Automatically fetch referenced documents
// ✗ More resource-intensive, only use when needed
// Note: Requires author field to be ObjectId reference type
/*
export const getPostWithAuthor = async (postId) => {
  return await Post.findById(postId)
    .populate('author', 'name email') // Get author details, select only name & email
    .lean();
};
*/

// PRO TIP 5: Aggregation Pipeline - Complex data transformations
// ✓ Powerful for analytics and complex queries
// ✓ Processes data on server before sending
// Stages: $match, $group, $sort, $project, $skip, $limit, $lookup
/*
export const getPostStatistics = async () => {
  return await Post.aggregate([
    // Filter
    { $match: { status: 'published' } },
    // Group by author
    { $group: {
        _id: '$author',
        count: { $sum: 1 },
        posts: { $push: '$title' },
        avgViews: { $avg: '$views' }
      }
    },
    // Sort by count descending
    { $sort: { count: -1 } },
    // Limit results
    { $limit: 10 }
  ]);
};
*/

// PRO TIP 6: Bulk Operations - Insert/Update multiple documents
// ✓ More efficient than looping
// ✓ Single database round trip
/*
export const bulkCreatePosts = async (postsArray) => {
  return await Post.insertMany(postsArray, { ordered: false });
};

export const bulkUpdatePosts = async (updates) => {
  const bulkOps = updates.map(update => ({
    updateOne: {
      filter: { _id: update.id },
      update: { $set: update.data }
    }
  }));
  return await Post.bulkWrite(bulkOps);
};
*/

// PRO TIP 7: Indexing for performance
// ✓ Speed up queries on frequently searched fields
// In schema: schema.index({ field: 1 })
// Compound index: schema.index({ field1: 1, field2: -1 })
// Text search: schema.index({ title: 'text', content: 'text' })
/*
export const searchPosts = async (query) => {
  return await Post.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
};
*/

// PRO TIP 8: Distinct - Get unique values
// ✓ Get all unique authors
// ✓ Get all unique statuses
/*
export const getUniqueAuthors = async () => {
  return await Post.distinct('author');
};
*/

// PRO TIP 9: Count with filters
// ✓ Efficient counting without fetching documents
// ✓ For pagination calculation
/*
export const countPublishedPosts = async () => {
  return await Post.countDocuments({ status: 'published' });
};
*/

// PRO TIP 10: Update with operators
// ✓ $inc - Increment value
// ✓ $push - Add to array
// ✓ $pull - Remove from array
// ✓ $set - Set value
// ✓ $unset - Remove field
/*
export const incrementViews = async (postId) => {
  return await Post.findByIdAndUpdate(
    postId,
    { $inc: { views: 1 } },
    { new: true }
  );
};

export const addTag = async (postId, tag) => {
  return await Post.findByIdAndUpdate(
    postId,
    { $push: { tags: tag } },
    { new: true }
  );
};
*/

// PRO TIP 11: Conditional updates
// ✓ Update based on current values
/*
export const updateOnlyIfDraft = async (postId, updates) => {
  return await Post.findByIdAndUpdate(
    { _id: postId, status: 'draft' },
    updates,
    { new: true }
  );
};
*/

// PRO TIP 12: Batch with limits to prevent memory issues
// ✓ Process large datasets in chunks
/*
export const processManyPosts = async (callback, batchSize = 100) => {
  let processed = 0;
  let hasMore = true;
  
  while (hasMore) {
    const posts = await Post.find()
      .limit(batchSize)
      .skip(processed)
      .lean();
    
    if (posts.length === 0) {
      hasMore = false;
    } else {
      for (const post of posts) {
        await callback(post);
      }
      processed += posts.length;
    }
  }
};
*/

export default {
  // Export functions above when needed
};
