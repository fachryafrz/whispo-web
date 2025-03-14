import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Chats
export const getChats = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return [];

    // Filter pinned chats
    const pinnedChats = await ctx.db
      .query("pinned_chats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const pinnedChatsIds = pinnedChats?.map((chat) => chat?.chatId);

    // Filter archived chats
    const archivedChats = await ctx.db
      .query("archived_chats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const archivedChatsIds = archivedChats?.map((chat) => chat?.chatId);

    const userChats = await ctx.db
      .query("chat_participants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const chats = userChats.filter(
      (chat) =>
        !pinnedChatsIds?.includes(chat.chatId) &&
        !archivedChatsIds?.includes(chat.chatId),
    );

    return await Promise.all(chats.map((chat) => ctx.db.get(chat.chatId)));
  },
});

export const getChatParticipants = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return [];

    const participants = await ctx.db
      .query("chat_participants")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    return await Promise.all(
      participants.map((participant) => ctx.db.get(participant.userId)),
    );
  },
});

export const selectOrStartConversation = mutation({
  args: {
    type: v.string(), // "private" or "group"
    targetId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    // NOTE: Check if there is already a chat between the user and the target
    const existingUserChats = await ctx.db
      .query("chat_participants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const existingChatIds = existingUserChats.map((p) => p.chatId);

    const existingTargetChats = await ctx.db
      .query("chat_participants")
      .withIndex("by_user", (q) => q.eq("userId", args.targetId))
      .collect();

    const existingTargetChatsIds = existingTargetChats.map((p) => p.chatId);

    const commonChatId = existingChatIds.find((chatId) =>
      existingTargetChatsIds.includes(chatId),
    );

    if (commonChatId) {
      // Delete unread messages
      const unreadMessages = await ctx.db
        .query("unread_messages")
        .withIndex("by_user_chat", (q) =>
          q.eq("userId", user._id).eq("chatId", commonChatId),
        )
        .first();

      if (unreadMessages) {
        await ctx.db.delete(unreadMessages._id);
      }

      return await ctx.db.get(commonChatId);
    }

    // NOTE: If not, create a new chat
    const chatId = await ctx.db.insert("chats", {
      type: args.type,
    });

    await ctx.db.insert("chat_participants", {
      chatId: chatId as Id<"chats">,
      userId: user._id,
    });
    await ctx.db.insert("chat_participants", {
      chatId: chatId as Id<"chats">,
      userId: args.targetId,
    });

    return await ctx.db.get(chatId);
  },
});

// Get pinned chats
export const pinnedChats = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return [];

    const pinnedChats = await ctx.db
      .query("pinned_chats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const chats = await Promise.all(
      pinnedChats.map((pc) => ctx.db.get(pc.chatId)),
    );

    return chats;
  },
});

// Pin a chat
export const pinChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    const existing = await ctx.db
      .query("pinned_chats")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }

    return await ctx.db.insert("pinned_chats", {
      userId: user._id,
      chatId: args.chatId,
    });
  },
});

// Get Archived chats
export const archivedChats = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    const pinnedChats = await ctx.db
      .query("archived_chats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const chats = await Promise.all(
      pinnedChats.map((pc) => ctx.db.get(pc.chatId)),
    );

    return chats;
  },
});

// Archive a chat
export const archiveChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    const existing = await ctx.db
      .query("archived_chats")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }

    const isPinned = await ctx.db
      .query("pinned_chats")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (isPinned) {
      await ctx.db.delete(isPinned._id);
    }

    return await ctx.db.insert("archived_chats", {
      userId: user._id,
      chatId: args.chatId,
    });
  },
});

// NOTE: When clearing chat, this also delete "chats" table
export const clearChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chat_messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .collect();

    const unreadMessages = await ctx.db
      .query("unread_messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    const isPinned = await ctx.db
      .query("pinned_chats")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .first();

    const isArchived = await ctx.db
      .query("archived_chats")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .first();

    const chatParticipants = await ctx.db
      .query("chat_participants")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    const deletedMessages = await ctx.db
      .query("deleted_messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    // Delete messages
    for (const message of messages) {
      // Delete media
      if (message?.mediaId) {
        await ctx.storage.delete(message.mediaId);
      }

      // Delete message
      await ctx.db.delete(message._id);
    }

    // Delete unread messages
    for (const unreadMessage of unreadMessages) {
      await ctx.db.delete(unreadMessage._id);
    }

    // Delete pinned chat
    if (isPinned) {
      await ctx.db.delete(isPinned._id);
    }

    // Delete archived chat
    if (isArchived) {
      await ctx.db.delete(isArchived._id);
    }

    // Delete chat participants
    for (const participant of chatParticipants) {
      await ctx.db.delete(participant._id);
    }

    // Remove deleted messages
    for (const deletedMessage of deletedMessages) {
      await ctx.db.delete(deletedMessage._id);
    }

    // Update last message to undefined
    // await ctx.db.patch(args.chatId, {
    //   lastMessage: undefined,
    //   lastMessageSender: undefined,
    //   lastMessageTime: undefined,
    // });

    return await ctx.db.delete(args.chatId);
  },
});

// Messages
export const getMessages = query({
  args: {
    chatId: v.id("chats"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return [];

    const deletedMessages = await ctx.db
      .query("deleted_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .collect();

    const deletedMessagesIds = deletedMessages.map(
      (message) => message.messageId,
    );

    const results = await ctx.db
      .query("chat_messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: results.page.filter((msg) => !deletedMessagesIds.includes(msg._id)), // Filter deleted messages
    };
  },
});

export const getMessage = query({
  args: {
    messageId: v.id("chat_messages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.messageId);
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    text: v.string(),
    mediaId: v.optional(v.id("_storage")),
    replyTo: v.optional(v.id("chat_messages")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    // Delete unread messages for current user
    const unreadMessages = await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (unreadMessages) {
      await ctx.db.delete(unreadMessages._id);
    }

    // Check if chat is archived
    const isArchived = await ctx.db
      .query("archived_chats")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (isArchived) {
      await ctx.db.delete(isArchived._id);
    }

    // Update chat last message
    await ctx.db.patch(args.chatId, {
      lastMessage: args.text,
      lastMessageSender: user._id,
      lastMessageTime: Date.now(),
      hasMedia: args.mediaId ? true : undefined,
    });

    // Insert message
    const message = await ctx.db.insert("chat_messages", {
      chatId: args.chatId,
      senderId: user._id,
      text: args.text,
      replyTo: args.replyTo,
      mediaId: args.mediaId,
    });

    return await ctx.db.get(message);
  },
});

export const editMessage = mutation({
  args: {
    messageId: v.id("chat_messages"),
    text: v.string(),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    // Delete unread messages for current user
    const unreadMessages = await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (unreadMessages) {
      await ctx.db.delete(unreadMessages._id);
    }

    return await ctx.db.patch(args.messageId, {
      text: args.text,
      isEdited: true,
    });
  },
});

export const unsendMessage = mutation({
  args: {
    messageId: v.id("chat_messages"),
    chatId: v.id("chats"),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    // Get message
    const message = await ctx.db.get(args.messageId);

    // Delete media if exists
    if (message?.mediaId) {
      await ctx.db.patch(args.chatId, { hasMedia: false });
      await ctx.storage.delete(message.mediaId);
      await ctx.db.patch(args.messageId, { mediaId: undefined });
    }

    // If this message is the latest, update the chat lastMessage
    if (args.index === 0) {
      await ctx.db.patch(args.chatId, {
        lastMessage: "_message was unsent_",
      });
    }

    // Delete unread messages for current user
    const unreadMessages = await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();

    if (unreadMessages) {
      await ctx.db.delete(unreadMessages._id);
    }

    return await ctx.db.patch(args.messageId, {
      isUnsent: true,
    });
  },
});

export const deleteMessage = mutation({
  args: {
    chatId: v.id("chats"),
    messageId: v.id("chat_messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    return await ctx.db.insert("deleted_messages", {
      chatId: args.chatId,
      messageId: args.messageId,
      userId: user._id,
    });
  },
});

// Message media
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getMedia = query({
  args: {
    mediaId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (!args.mediaId) return;

    return await ctx.storage.getUrl(args.mediaId);
  },
});

// Unread messages
export const getUnreadMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return;

    return await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", user._id).eq("chatId", args.chatId),
      )
      .first();
  },
});

export const addUnreadMessage = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.id("chats"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", args.userId).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        count: existing.count + args.count,
      });
    }

    return await ctx.db.insert("unread_messages", args);
  },
});

// NOTE: Mark message as read by deleting unread message
export const readMessage = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unread_messages")
      .withIndex("by_user_chat", (q) =>
        q.eq("userId", args.userId).eq("chatId", args.chatId),
      )
      .first();

    if (existing) {
      return await ctx.db.delete(existing._id);
    }
  },
});
