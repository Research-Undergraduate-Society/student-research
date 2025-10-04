import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  articles: defineTable({
    title: v.string(),
    content: v.string(),
    author: v.string(),
    publicationDate: v.number(),
    category: v.string(), // "news" or "newspaper"
    summary: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_publication_date", ["publicationDate"])
    .index("by_category_and_date", ["category", "publicationDate"]),
  
  journals: defineTable({
    title: v.string(),
    authors: v.array(v.string()),
    abstract: v.string(),
    publicationDate: v.number(),
    pdfUrl: v.string(),
  })
    .index("by_publication_date", ["publicationDate"]),
  
  events: defineTable({
    title: v.string(),
    description: v.string(),
    eventDate: v.number(),
    location: v.string(),
  })
    .index("by_event_date", ["eventDate"]),

  societies: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  pages: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
  })
    .index("by_slug", ["slug"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
