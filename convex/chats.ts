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
      throw new Error("Not authenticated");
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

export const store = mutation({
  handler: async (ctx, args: Chat) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
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

export const checkChatExists = query({
  args: { type: v.string(), participants: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
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
      .withIndex("by_participants_and_type", (q) =>
        q.eq("participants", args.participants).eq("type", args.type),
      )
      .collect(); // Ambil semua chat dengan tipe yang sama

    console.log(existingChats);

    // const existingChat = existingChats.find((chat) =>
    //   arraysEqual(
    //     chat.participants.map((p) => p),
    //     args.participants.map((p) => p),
    //   ),
    // );

    // if (existingChat) {
    //   await ctx.db.patch(existingChat._id, args);

    //   return await ctx.db.get(existingChat._id);
    // }
  },
});
