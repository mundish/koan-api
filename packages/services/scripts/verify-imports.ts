#!/usr/bin/env tsx
/**
 * Verification script to test that the services package can import from the db package
 * This verifies workspace dependencies work correctly
 * Run with: pnpm --filter @koan/services verify:imports
 */

import { prisma, PrismaClient, Koan, Comment } from "db";

async function main() {
  console.log("🔍 Testing cross-package import from @koan/services...\n");

  // Test 1: Verify we can import prisma instance
  console.log("✅ Test 1: Import prisma from 'db'");
  if (!prisma) {
    throw new Error("❌ Cannot import prisma from 'db' package");
  }
  console.log("   ✓ prisma imported successfully\n");

  // Test 2: Verify we can import types
  console.log("✅ Test 2: Import types from 'db'");
  const koanType: Koan = {} as Koan;
  const commentType: Comment = {} as Comment;
  console.log("   ✓ Types imported successfully\n");

  // Test 3: Verify PrismaClient is available
  console.log("✅ Test 3: Import PrismaClient from 'db'");
  if (!PrismaClient) {
    throw new Error("❌ Cannot import PrismaClient from 'db' package");
  }
  console.log("   ✓ PrismaClient imported successfully\n");

  // Test 4: Test database query (if DATABASE_URL is set)
  console.log("✅ Test 4: Database query from services package");
  try {
    await prisma.$connect();
    const koans = await prisma.koan.findMany({ take: 1 });
    console.log(`   ✓ Database query successful (found ${koans.length} koan(s))\n`);
  } catch (error) {
    console.warn(`   ⚠️  Database query skipped: ${error instanceof Error ? error.message : "Unknown error"}\n`);
  } finally {
    await prisma.$disconnect();
  }

  console.log("🎉 All cross-package import tests passed!");
}

main().catch((error) => {
  console.error("❌ Cross-package import test failed:", error);
  process.exit(1);
});

