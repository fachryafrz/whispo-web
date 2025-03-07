import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  chats: defineTable({
    type: v.string(),
    participants: v.array(v.string()),
    name: v.string(),
  }),

  messages: defineTable({
    chat: v.id("chats"),
    sender: v.id("users"),
    content: v.string(),
    mediaUrl: v.string(),
    readBy: v.array(v.id("users")),
  }),

  friendships: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    status: v.string(),
  }),
});
