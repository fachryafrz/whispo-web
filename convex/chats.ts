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
    const username = identity.nickname;

    const allChats = await ctx.db.query("chats").collect();
    const userChats = allChats.filter((chat) =>
      chat.participants.some(
        (participant) => participant.username === username,
      ),
    );

    return userChats;
  },
});

export const store = mutation({
  handler: async (ctx, args: Chat) => {
    const existingChat = await ctx.db
      .query("chats")
      .withIndex("by_participants_and_type", (q) =>
        q.eq("participants", args.participants).eq("type", args.type),
      )
      .first();

    if (existingChat) {
      // return existingChat;
      return await ctx.db.patch(existingChat._id, args);
    }

    return await ctx.db.insert("chats", args);
  },
});
