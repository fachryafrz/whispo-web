import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getUnread = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    return await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();
  },
});

export const addUnreadMessage = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.id("chats"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", args.userId).eq("chatId", args.chatId),
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

export const deleteUnreadMessage = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", args.userId).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }
  },
});
