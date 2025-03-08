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
      throw new Error("Not authenticated");
    }

    const allChats = await ctx.db.query("chats").collect();
    const userChats = allChats.filter((chat) =>
      chat.participants.some(
        (participant) => participant.username === identity.nickname,
      ),
    );

    return userChats;
  },
});

export const store = mutation({
  handler: async (ctx, args: Chat) => {
    const existingChats = await ctx.db
      .query("chats")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect(); // Ambil semua chat dengan tipe yang sama

    // Filter manual untuk cek apakah `participants` sama persis
    const existingChat = existingChats.find((chat) =>
      arraysEqual(
        chat.participants.map((p) => p.id),
        args.participants.map((p) => p.id),
      ),
    );

    if (existingChat) {
      await ctx.db.patch(existingChat._id, args);

      return await ctx.db.get(existingChat._id);
    }

    return await ctx.db.insert("chats", args);
  },
});
