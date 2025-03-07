import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const store = mutation({
  args: {
    chat: v.id("chats"),
    sender: v.id("users"),
    content: v.string(),
    mediaUrl: v.string(),
    readBy: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      chat: args.chat,
      sender: args.sender,
      content: args.content,
      mediaUrl: args.mediaUrl,
      readBy: args.readBy,
    });
  },
});
