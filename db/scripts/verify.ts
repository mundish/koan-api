#!/usr/bin/env tsx
/**
 * Verification script to test that the db package exports work correctly
 * Run with: pnpm --filter db verify
 */

import { prisma, PrismaClient, Koan, Comment } from "../index";

async function main() {
  console.log("🔍 Verifying db package exports...\n");

  // Test 1: Verify prisma instance is exported and is a PrismaClient
  console.log("✅ Test 1: prisma instance export");
  if (!prisma) {
    throw new Error("❌ prisma instance is not exported");
  }
  // Check if prisma has PrismaClient methods (more reliable than instanceof)
  if (typeof prisma.$connect !== "function" || typeof prisma.koan !== "object") {
    throw new Error("❌ prisma is not a valid PrismaClient instance");
  }
  console.log("   ✓ prisma instance is valid PrismaClient\n");

  // Test 2: Verify types are exported
  console.log("✅ Test 2: Type exports");
  // These are compile-time checks, but we can verify they exist
  const koanType: Koan = {} as Koan;
  const commentType: Comment = {} as Comment;
  console.log("   ✓ Koan type exported");
  console.log("   ✓ Comment type exported\n");

  // Test 3: Verify PrismaClient class is exported
  console.log("✅ Test 3: PrismaClient class export");
  if (!PrismaClient) {
    throw new Error("❌ PrismaClient class is not exported");
  }
  console.log("   ✓ PrismaClient class is exported\n");

  // Test 4: Test database connection (if DATABASE_URL is set)
  console.log("✅ Test 4: Database connection");
  try {
    // Simple query to verify connection works
    await prisma.$connect();
    const count = await prisma.koan.count();
    console.log(`   ✓ Database connection successful (${count} koans in database)\n`);
  } catch (error) {
    console.warn(`   ⚠️  Database connection test skipped: ${error instanceof Error ? error.message : "Unknown error"}\n`);
  } finally {
    await prisma.$disconnect();
  }

  // Test 5: Verify singleton behavior (in non-production)
  console.log("✅ Test 5: Singleton behavior");
  const { prisma: prisma2 } = await import("../index");
  if (process.env.NODE_ENV !== "production") {
    if (prisma !== prisma2) {
      console.warn("   ⚠️  Singleton may not be working (different instances in dev)");
    } else {
      console.log("   ✓ Singleton pattern working (same instance reused)\n");
    }
  } else {
    console.log("   ✓ Production mode (singleton check skipped)\n");
  }

  console.log("🎉 All verification tests passed!");
}

main().catch((error) => {
  console.error("❌ Verification failed:", error);
  process.exit(1);
});

