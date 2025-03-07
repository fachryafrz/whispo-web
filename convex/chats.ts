import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chats").collect();
  },
});

export const store = mutation({
  args: {
    type: v.string(),
    participants: v.array(v.string()),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chats", {
      type: args.type,
      participants: args.participants,
      name: args.name,
    });
  },
});
