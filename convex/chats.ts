import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chats").collect();
  },
});

export const getChatsByCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Mendapatkan identitas pengguna yang sedang login
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    // Menggunakan ID pengguna dari identity
    const userId = identity.tokenIdentifier;

    const allChats = await ctx.db.query("chats").collect();
    const userChats = allChats.filter((chat) =>
      chat.participants.includes(userId),
    );

    return userChats;
  },
});

export const store = mutation({
  args: {
    type: v.string(),
    participants: v.array(v.string()),
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    lastMessage: v.string(),
    lastMessageSender: v.string(),
    lastMessageTime: v.number(),
    pinned: v.boolean(),
    unreadCount: v.number(),
    seenBy: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chats", {
      type: args.type,
      participants: args.participants,
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl,
      lastMessage: args.lastMessage,
      lastMessageSender: args.lastMessageSender,
      lastMessageTime: args.lastMessageTime,
      pinned: args.pinned,
      unreadCount: args.unreadCount,
      seenBy: args.seenBy,
    });
  },
});
