import type { KoanWithComments } from "@koan/common";
import { prisma } from "db";

/**
 * Service layer for Koan API operations
 *
 * All database operations are encapsulated here following the architecture rule:
 * - All Prisma calls live in this service layer
 * - No HTTP concerns in this layer
 * - Reusable across Express, Hono, and GraphQL implementations
 */

/**
 * Fetch all koans with their nested comment threads
 *
 * @returns Promise resolving to an array of koans with nested comment threads
 */
export async function getKoansWithThreads(): Promise<KoanWithComments[]> {
  // Fetch all koans with their comments included
  const koans = await prisma.koan.findMany({
    include: {
      comments: true,
    },
  });

  // TODO: Transform flat comments into nested thread structure
  // For now, return empty comments array - will be implemented in next step
  return koans.map((koan) => ({
    id: koan.id,
    text: koan.text,
    source: koan.source,
    author: koan.author,
    comments: [], // Will be populated in step 3 (threading logic)
  }));
}
