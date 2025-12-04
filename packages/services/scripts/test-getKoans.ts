#!/usr/bin/env tsx
/**
 * Test script for getKoansWithThreads function
 * Run with: pnpm --filter @koan/services tsx scripts/test-getKoans.ts
 */

import { getKoansWithThreads } from "../KoanService";

async function main() {
  console.log("🔍 Testing getKoansWithThreads()...\n");

  try {
    const koans = await getKoansWithThreads();

    console.log(`✅ Successfully fetched ${koans.length} koan(s)\n`);

    if (koans.length === 0) {
      console.log("⚠️  No koans found in database. Run seed script first:");
      console.log("   pnpm --filter db seed\n");
      return;
    }

    // Display first koan as example
    const firstKoan = koans[0];
    console.log("📝 First koan:");
    console.log(`   ID: ${firstKoan.id}`);
    console.log(`   Author: ${firstKoan.author}`);
    console.log(`   Source: ${firstKoan.source}`);
    console.log(`   Text preview: ${firstKoan.text.substring(0, 50)}...`);
    console.log(`   Comments: ${firstKoan.comments.length} (threading not implemented yet)\n`);

    // Show all koans summary
    console.log("📊 Summary:");
    koans.forEach((koan, index) => {
      console.log(`   ${index + 1}. ${koan.author} - "${koan.source}" (${koan.comments.length} comments)`);
    });

    console.log("\n🎉 Test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
    process.exit(1);
  }
}

main();

