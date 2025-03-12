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

    if (!identity) {
      // throw new Error("Not authenticated");
      return;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      // throw new Error("User not found");
      return [];
    }

    const allChats = await ctx.db.query("chats").collect();
    const userChats = allChats.filter((chat) =>
      chat.participants.some((participant) => participant === user._id),
    );

    return userChats;
  },
});

export const getArchivedChatsByCurrentUser = query({
  args: {},
  handler: async (ctx, args) => {
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
      .unique();

    if (!user) {
      // throw new Error("User not found");
      return [];
    }

    const allChats = await ctx.db.query("chats").collect();
    const userChats = allChats.filter((chat) =>
      chat.participants.some((participant) => participant === user._id),
    );
    const archivedChats = userChats.filter((chat) => chat.archived);

    return archivedChats;
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
  args: {
    type: v.string(),
    participants: v.array(v.id("users")),
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

export const pinChat = mutation({
  args: {
    _id: v.id("chats"),
    pinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args._id, { pinned: args.pinned });
  },
});

export const archiveChat = mutation({
  args: {
    _id: v.id("chats"),
    archived: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args._id, { archived: args.archived });
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
