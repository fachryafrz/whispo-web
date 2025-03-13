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
    type: v.string(), // "private" or "group"
    participants: v.array(v.id("users")),
    name: v.optional(v.string()), // For group chats
    description: v.optional(v.string()), // For group chats
    imageUrl: v.optional(v.string()), // For group chats
    lastMessage: v.optional(v.string()),
    lastMessageSender: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
    pinned: v.optional(v.boolean()),
    // unreadCount: v.optional(v.number()),
    seenBy: v.optional(v.array(v.id("users"))),
    archived: v.optional(v.boolean()),
  })
    .index("by_type", ["type"])
    .index("by_participants_and_type", ["participants", "type"]),

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

  messages: defineTable({
    chat: v.id("chats"),
    sender: v.id("users"),
    content: v.string(),
    mediaUrl: v.optional(v.id("_storage")),
    readBy: v.optional(v.array(v.id("users"))),
    editedBy: v.optional(v.id("users")),
    replyTo: v.optional(v.id("messages")),
    deletedBy: v.optional(v.array(v.id("users"))),
    deletedAt: v.optional(v.array(v.number())),
    unsentBy: v.optional(v.id("users")),
    unsentAt: v.optional(v.number()),
  }).index("by_chat", ["chat"]),

  unread_messages: defineTable({
    user: v.id("users"), // User that has unread messages
    chat: v.id("chats"), // Related chat
    count: v.number(), // Unread message count
  })
    .index("by_user", ["user"])
    .index("by_chat", ["chat"])
    .index("by_user_chat", ["user", "chat"]),

  friendships: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    status: v.string(),
  }).index("by_users", ["user1", "user2"]),
});
