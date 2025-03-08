import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    avatarUrl: v.string(),
  })
    .index("by_token", ["tokenIdentifier"])
    .searchIndex("search_username", {
      searchField: "username",
    }),

  chats: defineTable({
    type: v.string(),
    participants: v.array(v.string()),
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    lastMessage: v.optional(v.string()),
    lastMessageSender: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
    pinned: v.optional(v.boolean()),
    unreadCount: v.optional(v.number()),
    seenBy: v.optional(v.array(v.id("users"))),
  }).index("by_participants", ["participants"]),

  messages: defineTable({
    chat: v.id("chats"),
    sender: v.id("users"),
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    readBy: v.optional(v.array(v.id("users"))),
  }).index("by_chat", ["chat"]),

  friendships: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    status: v.string(),
  }).index("by_users", ["user1", "user2"]),
});
