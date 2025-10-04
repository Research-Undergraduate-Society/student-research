import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all societies
export const listSocieties = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("societies")
      .order("asc")
      .collect();
  },
});

// Get all societies
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("societies")
      .order("asc")
      .collect();
  },
});

// Get a single society by ID
export const getById = query({
  args: { id: v.id("societies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new society
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to create societies");
    }
    
    return await ctx.db.insert("societies", args);
  },
});

// Update an existing society
export const update = mutation({
  args: {
    id: v.id("societies"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to update societies");
    }
    
    const { id, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete a society
export const remove = mutation({
  args: { id: v.id("societies") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to delete societies");
    }
    
    await ctx.db.delete(args.id);
  },
});
