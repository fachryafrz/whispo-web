import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { Message } from "@/types";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const getMessagesByChatId = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chat", args.chatId))
      .order("desc")
      .collect();
  },
});

export const store = mutation({
  handler: async (ctx, args: Message) => {
    if (!args.sender || !args.chat || !args.content) return;

    return await ctx.db.insert("messages", args);
  },
});
