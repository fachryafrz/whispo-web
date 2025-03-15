import dayjs from "dayjs";

import { Doc } from "@/convex/_generated/dataModel";

export const groupMessagesByDate = (messages: Doc<"chat_messages">[]) => {
  return messages.reduce(
    (acc: { [key: string]: Doc<"chat_messages">[] }, message) => {
      const dateKey = dayjs(message._creationTime).format("YYYY-MM-DD");

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(message);

      return acc;
    },
    {},
  );
};
