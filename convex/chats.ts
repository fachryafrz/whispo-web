import { mutation, query } from "./_generated/server";

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
  handler: async (ctx, args: Chat) => {
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
