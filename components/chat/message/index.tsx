/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import dayjs from "dayjs";

import ReplyTo from "./reply-to";
import MessageOptions from "./message-options";
import Media from "./media";

import { Doc } from "@/convex/_generated/dataModel";

export default function Message({
  msg,
  currentUser,
  index,
}: {
  msg: Doc<"messages">;
  currentUser: Doc<"users">;
  index: number;
}) {
  return (
    <div
      className={`group flex gap-1 ${
        msg.sender === currentUser?._id ? "justify-end" : "justify-start"
      }`}
    >
      {/* Message */}
      <div
        className={`relative w-fit max-w-xs rounded-md lg:max-w-lg xl:max-w-xl ${
          msg.sender === currentUser?._id
            ? "order-2 bg-default"
            : "order-1 bg-black text-white dark:bg-white dark:text-black"
        }`}
      >
        <div className="space-y-2 p-2">
          {/* Reply to */}
          {msg.replyTo && !msg.unsentBy && <ReplyTo msg={msg} />}

          {/* TODO: Media */}
          {msg.mediaUrl && !msg.unsentBy && <Media msg={msg} />}

          {/* Text content */}
          <div className="flex gap-2">
            {/* NOTE: Kalau pakai text, gabisa markdown */}
            {/* <p className="max-w-full whitespace-pre-wrap text-sm">
                    {msg.content}
                  </p> */}

            {/* NOTE: Kalau pakai markdown, gabisa multiple line breaks */}
            <div
              className={`prose text-sm ${
                msg.sender === currentUser?._id
                  ? "text-black marker:text-black dark:text-white dark:marker:text-white"
                  : "text-white marker:text-white dark:text-black dark:marker:text-black"
              }`}
              style={{
                wordBreak: "break-word",
              }}
            >
              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className={`${
                        msg.sender === currentUser?._id
                          ? "text-black dark:text-white"
                          : "text-white dark:text-black"
                      }`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {props.children}
                    </a>
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className={`${
                        msg.sender === currentUser?._id
                          ? "text-black dark:text-white"
                          : "text-white dark:text-black"
                      }`}
                    >
                      {props.children}
                    </blockquote>
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  code: ({ node, ...props }) => (
                    <code {...props} className={`text-white`}>
                      {props.children}
                    </code>
                  ),
                }}
                remarkPlugins={[remarkGfm, remarkBreaks]}
              >
                {msg.unsentBy ? `_message was unsent_` : msg.content}
              </ReactMarkdown>
            </div>

            {/* Time placeholder */}
            <span
              className={`pointer-events-none flex grow justify-end text-[10px] opacity-0`}
            >
              {dayjs(msg._creationTime).format("HH:mm")}
            </span>

            {/* Time displayed */}
            <span
              className={`pointer-events-none absolute bottom-2 right-2 mt-1 text-[10px]`}
            >
              {dayjs(msg._creationTime).format("HH:mm")}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className={`pointer-events-none flex items-end opacity-0 transition-all group-hover:pointer-events-auto group-hover:opacity-100 ${
          msg.sender === currentUser?._id ? "order-1" : "order-2"
        }`}
      >
        <MessageOptions index={index} msg={msg} />
      </div>
    </div>
  );
}
