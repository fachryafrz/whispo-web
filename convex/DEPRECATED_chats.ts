import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";

import { arraysEqual } from "@/helper/arrays-equal";

export const getAllChats = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("chats").paginate(args.paginationOpts);
  },
});

export const getChatsByCurrentUser = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return [];

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
      chat?.participants.map((p) => ctx.db.get(p)) || [],
    );

    return { ...chat, participants };
  },
});

export const store = mutation({
  args: {
    type: v.string(),
    participants: v.array(v.id("users")),
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

    // Check chats with same type
    const existingChats = await ctx.db
      .query("chats")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect(); // Ambil semua chat dengan tipe yang sama

    // Check chats with same participants
    const existingChat = existingChats.find((chat) =>
      arraysEqual(
        chat.participants.map((p) => p),
        args.participants.map((p) => p),
      ),
    );

    if (existingChat) {
      await ctx.db.patch(existingChat._id, args);

      const unreadMessages = await ctx.db
        .query("unread_messages")
        .withIndex("by_user_chat", (q) =>
          q.eq("user", user._id).eq("chat", existingChat._id),
        )
        .first();

      if (unreadMessages) {
        await ctx.db.delete(unreadMessages._id);
      }

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

// NOTE: Refactored
export const pinnedChats = query({
  args: {},
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

    const pinnedChats = await ctx.db
      .query("pinned_chats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const chats = await Promise.all(
      pinnedChats.map((pc) => ctx.db.get(pc.chatId)),
    );

    return chats;
  },
});

export const pinChat = mutation({
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

    const existing = await ctx.db
      .query("pinned_chats")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }

    return await ctx.db.insert("pinned_chats", {
      userId: user._id,
      chatId: args.chatId,
    });
  },
});

export const archivedChats = query({
  args: {},
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

    const pinnedChats = await ctx.db
      .query("archived_chats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const chats = await Promise.all(
      pinnedChats.map((pc) => ctx.db.get(pc.chatId)),
    );

    return chats;
  },
});

export const archiveChat = mutation({
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

    const existing = await ctx.db
      .query("archived_chats")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }

    const isPinned = await ctx.db
      .query("pinned_chats")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (isPinned) {
      await ctx.db.delete(isPinned._id);
    }

    return await ctx.db.insert("archived_chats", {
      userId: user._id,
      chatId: args.chatId,
    });
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chat", args.chatId))
      .order("desc")
      .collect();

    const unreadMessages = await ctx.db
      .query("unread_messages")
      .withIndex("by_chat", (q) => q.eq("chat", args.chatId))
      .collect();

    const pinnedChats = await ctx.db
      .query("pinned_chats")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const unreadMessage of unreadMessages) {
      await ctx.db.delete(unreadMessage._id);
    }

    for (const pinnedChat of pinnedChats) {
      await ctx.db.delete(pinnedChat._id);
    }

    return await ctx.db.delete(args.chatId);
  },
});
// NOTE: Refactored
