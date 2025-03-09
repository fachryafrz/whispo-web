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
      .take(10);
  },
});

export const getMessageById = query({
  args: { _id: v.id("messages") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_id", (q) => q.eq("_id", args._id))
      .first();
  },
});

export const store = mutation({
  handler: async (ctx, args: Message) => {
    if (!args.sender || !args.chat || !args.content) return;

    return await ctx.db.insert("messages", args);
  },
});

export const editMessage = mutation({
  args: { _id: v.id("messages"), content: v.string(), editedBy: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args._id, {
      content: args.content,
      editedBy: args.editedBy,
    });
  },
});

export const unsendMessage = mutation({
  args: { _id: v.id("messages") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args._id);
  },
});
