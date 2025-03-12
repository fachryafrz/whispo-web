import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    chat: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // throw new Error("Not authenticated");
      return;
    }

    // Get current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      // throw new Error("User not found");
      return;
    }

    return await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("user", user._id).eq("chat", args.chat),
      )
      .first();
  },
});

export const store = mutation({
  args: {
    user: v.id("users"),
    chat: v.id("chats"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("user", args.user).eq("chat", args.chat),
      )
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        count: existing.count + args.count,
      });
    }

    return await ctx.db.insert("unread_messages", args);
  },
});
