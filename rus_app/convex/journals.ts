import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all journals, ordered by publication date (most recent first)
export const listAllJournals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("journals")
      .withIndex("by_publication_date")
      .order("desc")
      .collect();
  },
});

// Get all journals, ordered by publication date
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("journals")
      .withIndex("by_publication_date")
      .order("desc")
      .collect();
  },
});

// Get recent journals for homepage preview
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    
    return await ctx.db
      .query("journals")
      .withIndex("by_publication_date")
      .order("desc")
      .take(limit);
  },
});

// Get a single journal by ID
export const getById = query({
  args: { id: v.id("journals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new journal
export const create = mutation({
  args: {
    title: v.string(),
    authors: v.array(v.string()),
    abstract: v.string(),
    pdfUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to create journals");
    }
    
    return await ctx.db.insert("journals", {
      ...args,
      publicationDate: Date.now(),
    });
  },
});

// Update an existing journal
export const update = mutation({
  args: {
    id: v.id("journals"),
    title: v.optional(v.string()),
    authors: v.optional(v.array(v.string())),
    abstract: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to update journals");
    }
    
    const { id, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete a journal
export const remove = mutation({
  args: { id: v.id("journals") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to delete journals");
    }
    
    await ctx.db.delete(args.id);
  },
});
