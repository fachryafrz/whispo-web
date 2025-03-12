import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getMessagesByChatId = query({
  args: {
    chatId: v.id("chats"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chat", args.chatId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getMessageById = query({
  args: {
    _id: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    if (!args._id) return;

    const message = await ctx.db
      .query("messages")
      .withIndex("by_id", (q) => q.eq("_id", args._id as Id<"messages">))
      .first();

    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", message?.sender as Id<"users">))
      .first();

    return { ...message, sender: user };
  },
});

export const getMessageMedia = query({
  args: {
    _id: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (!args._id) return;

    return await ctx.storage.getUrl(args._id);
  },
});

export const store = mutation({
  args: {
    chat: v.id("chats"),
    sender: v.id("users"),
    content: v.string(),
    replyTo: v.optional(v.id("messages")),
    mediaUrl: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (!args.sender || !args.chat || !args.content) return;

    return await ctx.db.insert("messages", args);
  },
});

export const editMessage = mutation({
  args: {
    _id: v.id("messages"),
    content: v.string(),
    editedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args._id, {
      content: args.content,
      editedBy: args.editedBy,
    });
  },
});

export const unsendMessage = mutation({
  args: {
    _id: v.id("messages"),
    unsentBy: v.id("users"),
    unsentAt: v.number(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args._id);

    if (message!._creationTime + 3600000 < Date.now()) {
      throw new Error("You can only unsend a message within 1 hour");
    }

    if (message?.mediaUrl) {
      ctx.storage.delete(message.mediaUrl);
    }

    return await ctx.db.patch(args._id, {
      unsentBy: args.unsentBy,
      unsentAt: args.unsentAt,
    });
  },
});

export const deleteMessage = mutation({
  args: {
    _id: v.id("messages"),
    deletedBy: v.array(v.id("users")),
    deletedAt: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args._id, {
      deletedBy: args.deletedBy,
      deletedAt: args.deletedAt,
    });
  },
});
