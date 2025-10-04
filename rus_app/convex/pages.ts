import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get a page by slug (e.g., "about-us")
export const getPageBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Get all pages
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pages")
      .order("asc")
      .collect();
  },
});

// Get a page by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Get a single page by ID
export const getById = query({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new page
export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to create pages");
    }
    
    // Check if slug already exists
    const existingPage = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    
    if (existingPage) {
      throw new Error("A page with this slug already exists");
    }
    
    return await ctx.db.insert("pages", args);
  },
});

// Update an existing page
export const update = mutation({
  args: {
    id: v.id("pages"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to update pages");
    }
    
    const { id, ...updates } = args;
    
    // If updating slug, check it doesn't already exist
    if (updates.slug) {
      const existingPage = await ctx.db
        .query("pages")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .unique();
      
      if (existingPage && existingPage._id !== id) {
        throw new Error("A page with this slug already exists");
      }
    }
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete a page
export const remove = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to delete pages");
    }
    
    await ctx.db.delete(args.id);
  },
});
