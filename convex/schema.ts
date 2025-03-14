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
    .searchIndex("search_username", { searchField: "username" }),

  chats: defineTable({
    type: v.string(), // "private" or "group"
    name: v.optional(v.string()), // For group chats
    description: v.optional(v.string()), // For group chats
    imageUrl: v.optional(v.string()), // For group chats
    lastMessage: v.optional(v.string()),
    lastMessageSender: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
    hasMedia: v.optional(v.boolean()),
  }).index("by_type", ["type"]),

  chat_participants: defineTable({
    chatId: v.id("chats"),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_chat", ["chatId"])
    .index("by_user_chat", ["userId", "chatId"]),

  chat_messages: defineTable({
    chatId: v.id("chats"),
    senderId: v.id("users"),
    text: v.string(),
    mediaId: v.optional(v.id("_storage")),
    replyTo: v.optional(v.id("chat_messages")),
    isEdited: v.optional(v.boolean()),
    isUnsent: v.optional(v.boolean()),
  }).index("by_chat", ["chatId"]),

  // TODO: add deleted_messages table
  deleted_messages: defineTable({
    chatId: v.id("chats"),
    messageId: v.id("chat_messages"),
    userId: v.id("users"),
  })
    .index("by_chat", ["chatId"])
    .index("by_message", ["messageId"])
    .index("by_user", ["userId"]),

  pinned_chats: defineTable({
    chatId: v.id("chats"),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_chat", ["chatId"])
    .index("by_user_chat", ["userId", "chatId"]),

  archived_chats: defineTable({
    chatId: v.id("chats"),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_chat", ["chatId"])
    .index("by_user_chat", ["userId", "chatId"]),

  unread_messages: defineTable({
    userId: v.id("users"), // User that has unread messages
    chatId: v.id("chats"), // Related chat
    count: v.number(), // Unread message count
  })
    .index("by_user", ["userId"])
    .index("by_chat", ["chatId"])
    .index("by_user_chat", ["userId", "chatId"]),

  friendships: defineTable({
    // TODO: friendships
    user1: v.id("users"),
    user2: v.id("users"),
    status: v.string(),
  }).index("by_users", ["user1", "user2"]),
});
