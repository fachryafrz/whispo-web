import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { arraysEqual } from "@/helper/arrays-equal";
import { Chat } from "@/types";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chats").collect();
  },
});

export const getChatsByCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // throw new Error("Not authenticated");
      return;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const allChats = await ctx.db.query("chats").collect();
    const userChats = allChats.filter((chat) =>
      chat.participants.some((participant) => participant === user._id),
    );

    return userChats;
  },
});

export const getChatById = query({
  args: { _id: v.id("chats") },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_id", (q) => q.eq("_id", args._id))
      .first();

    const participants = await Promise.all(
      chat?.participants.map((p) =>
        ctx.db
          .query("users")
          .withIndex("by_id", (q) => q.eq("_id", p))
          .first(),
      ) || [],
    );

    return { ...chat, participants };
  },
});

export const store = mutation({
  handler: async (ctx, args: Chat) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // throw new Error("Not authenticated");
      return;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const existingChats = await ctx.db
      .query("chats")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect(); // Ambil semua chat dengan tipe yang sama

    const existingChat = existingChats.find((chat) =>
      arraysEqual(
        chat.participants.map((p) => p),
        args.participants.map((p) => p),
      ),
    );

    if (existingChat) {
      await ctx.db.patch(existingChat._id, args);

      return await ctx.db.get(existingChat._id);
    }

    return await ctx.db.insert("chats", args);
  },
});

export const updateChatById = mutation({
  args: {
    _id: v.id("chats"),
    lastMessage: v.optional(v.string()),
    lastMessageSender: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args._id, args);
  },
});

export const deleteChat = mutation({
  args: { _id: v.id("chats") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chat", args._id))
      .order("desc")
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    return await ctx.db.delete(args._id);
  },
});
