
import { mutation, query } from "./_generated/server";

import { Friendship } from "@/types";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("friendships").collect();
  },
});

export const store = mutation({
  handler: async (ctx, args: Friendship) => {
    return await ctx.db.insert("friendships", args);
  },
});

export const check = query({
  handler: async (ctx, args: Friendship) => {
    return await ctx.db
      .query("friendships")
      .filter((q) => q.eq(q.field("user1"), args.user1))
      .filter((q) => q.eq(q.field("user2"), args.user2))
      .unique();
  },
});
