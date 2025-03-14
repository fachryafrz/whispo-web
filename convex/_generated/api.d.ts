/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chats from "../chats.js";
import type * as DEPRECATED_chats from "../DEPRECATED_chats.js";
import type * as DEPRECATED_messages from "../DEPRECATED_messages.js";
import type * as DEPRECATED_unread_messages from "../DEPRECATED_unread_messages.js";
import type * as friendships from "../friendships.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  chats: typeof chats;
  DEPRECATED_chats: typeof DEPRECATED_chats;
  DEPRECATED_messages: typeof DEPRECATED_messages;
  DEPRECATED_unread_messages: typeof DEPRECATED_unread_messages;
  friendships: typeof friendships;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
