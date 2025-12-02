/**
 * Shared TypeScript interfaces mapping Prisma models
 * 
 * These types provide a clean API layer abstraction over Prisma models.
 * They can be used across Express, Hono, and GraphQL implementations.
 */

/**
 * Vote counts for comments
 */
export interface Votes {
  up: number;
  down: number;
}

/**
 * Base Koan interface matching the Prisma model
 */
export interface Koan {
  id: string;
  text: string; // Uses \n\n as paragraph delimiter
  source: string;
  author: string;
}

/**
 * Koan with nested comments (used when fetching koans with their comment threads)
 */
export interface KoanWithComments extends Koan {
  comments: CommentWithReplies[];
}

/**
 * Base Comment interface matching the Prisma model
 */
export interface Comment {
  id: string;
  text: string;
  date: Date;
  author: string; // userId
  votes: Votes; // JSONB object: { up: number, down: number }
  koanId: string;
  parentId: string | null; // null for top-level comments
}

/**
 * Comment with nested replies (for threaded comment structure)
 */
export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

/**
 * Input type for creating a new comment
 */
export interface CreateCommentInput {
  text: string;
  author: string;
  koanId: string;
  parentId?: string | null; // Optional for top-level comments
  votes?: Votes; // Optional, defaults to { up: 0, down: 0 }
}

/**
 * Input type for creating a reply to an existing comment
 */
export interface CreateReplyInput {
  text: string;
  author: string;
  koanId: string;
  parentId: string; // Required for replies
  votes?: Votes;
}

