import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get recent articles by category (for homepage)
export const listRecentArticles = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 3;
    
    return await ctx.db
      .query("articles")
      .withIndex("by_category_and_date", (q) => 
        q.eq("category", "news")
      )
      .order("desc")
      .take(limit);
  },
});

// Get all articles by category
export const listArticlesByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_category_and_date", (q) => 
        q.eq("category", args.category)
      )
      .order("desc")
      .collect();
  },
});

// Get all articles, optionally filtered by category
export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("articles")
        .withIndex("by_category_and_date", (q) => 
          q.eq("category", args.category!)
        )
        .order("desc")
        .collect();
    } else {
      return await ctx.db
        .query("articles")
        .withIndex("by_publication_date")
        .order("desc")
        .collect();
    }
  },
});

// Get recent articles for homepage preview
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    
    if (args.category) {
      return await ctx.db
        .query("articles")
        .withIndex("by_category_and_date", (q) => 
          q.eq("category", args.category!)
        )
        .order("desc")
        .take(limit);
    } else {
      return await ctx.db
        .query("articles")
        .withIndex("by_publication_date")
        .order("desc")
        .take(limit);
    }
  },
});

// Get a single article by ID
export const getById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new article
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    author: v.string(),
    category: v.string(),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to create articles");
    }
    
    // Validate category
    if (args.category !== "news" && args.category !== "newspaper") {
      throw new Error("Category must be either 'news' or 'newspaper'");
    }
    
    return await ctx.db.insert("articles", {
      ...args,
      publicationDate: Date.now(),
    });
  },
});

// Update an existing article
export const update = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    author: v.optional(v.string()),
    category: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to update articles");
    }
    
    const { id, ...updates } = args;
    
    // Validate category if provided
    if (updates.category && updates.category !== "news" && updates.category !== "newspaper") {
      throw new Error("Category must be either 'news' or 'newspaper'");
    }
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete an article
export const remove = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to delete articles");
    }
    
    await ctx.db.delete(args.id);
  },
});
