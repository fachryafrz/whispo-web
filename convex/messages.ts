import { mutation, query } from "./_generated/server";

import { Message } from "@/types";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const store = mutation({
  handler: async (ctx, args: Message) => {
    return await ctx.db.insert("messages", {
      chat: args.chat,
      sender: args.sender,
      content: args.content,
      mediaUrl: args.mediaUrl,
      readBy: args.readBy,
    });
  },
});
