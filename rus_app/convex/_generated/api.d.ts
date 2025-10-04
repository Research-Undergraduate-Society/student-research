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
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as cli from "../cli.js";
import type * as events from "../events.js";
import type * as http from "../http.js";
import type * as journals from "../journals.js";
import type * as pages from "../pages.js";
import type * as router from "../router.js";
import type * as seed from "../seed.js";
import type * as societies from "../societies.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  articles: typeof articles;
  auth: typeof auth;
  cli: typeof cli;
  events: typeof events;
  http: typeof http;
  journals: typeof journals;
  pages: typeof pages;
  router: typeof router;
  seed: typeof seed;
  societies: typeof societies;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
