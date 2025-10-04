import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get upcoming events (events in the future)
export const listUpcomingEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const now = Date.now();
    
    return await ctx.db
      .query("events")
      .withIndex("by_event_date", (q) => q.gte("eventDate", now))
      .order("asc")
      .take(limit);
  },
});

// Get all events, ordered by event date
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_event_date")
      .order("asc")
      .collect();
  },
});

// Get upcoming events
export const getUpcoming = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    const now = Date.now();
    
    return await ctx.db
      .query("events")
      .withIndex("by_event_date", (q) => q.gte("eventDate", now))
      .order("asc")
      .take(limit);
  },
});

// Get a single event by ID
export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new event
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    eventDate: v.number(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to create events");
    }
    
    return await ctx.db.insert("events", args);
  },
});

// Update an existing event
export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to update events");
    }
    
    const { id, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete an event
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to delete events");
    }
    
    await ctx.db.delete(args.id);
  },
});
