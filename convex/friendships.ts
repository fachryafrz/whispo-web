import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("friendships").collect();
  },
});

export const store = mutation({
  args: {
    user1: v.id("users"),
    user2: v.id("users"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("friendships", {
      user1: args.user1,
      user2: args.user2,
      status: args.status,
    });
  },
});
