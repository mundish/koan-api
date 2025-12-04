# Verification Guide

This document outlines how to verify that the `db` package wrapper API works correctly and nothing has regressed.

## Prerequisites

1. Ensure dependencies are installed:

   ```bash
   pnpm install
   ```

2. Ensure Prisma client is generated:

   ```bash
   pnpm --filter db db:generate
   ```

3. (Optional) Ensure `.env` file exists with `DATABASE_URL` set for database connection tests

## Verification Steps

### Step 1: Verify Package Exports (Internal)

Test that the `db` package exports work correctly from within the package:

```bash
pnpm --filter db verify
```

This will test:

- ✅ `prisma` instance is exported and is a valid PrismaClient
- ✅ Types (`Koan`, `Comment`) are exported
- ✅ `PrismaClient` class is exported
- ✅ Database connection works (if `DATABASE_URL` is set)
- ✅ Singleton pattern works in development mode

### Step 2: Verify Cross-Package Imports

Test that other packages can import from `db`:

```bash
pnpm --filter @koan/services test:import
```

This will test:

- ✅ Can import `prisma` from `"db"` package
- ✅ Can import types from `"db"` package
- ✅ Can import `PrismaClient` from `"db"` package
- ✅ Database queries work from external packages

### Step 3: Verify Seed Script Still Works

Test that the seed script works with the new wrapper:

```bash
pnpm --filter db seed
```

This should:

- ✅ Successfully seed the database with sample data
- ✅ Use the shared `prisma` instance from `db/client.ts`
- ✅ Complete without errors

### Step 4: Verify Prisma Commands

Test that all Prisma commands still work:

```bash
# Validate schema
pnpm --filter db db:validate

# Generate client
pnpm --filter db db:generate

# (Optional) Run migrations
pnpm --filter db db:migrate

# (Optional) Open Prisma Studio
pnpm --filter db db:studio
```

## Expected Results

All verification steps should complete successfully with:

- ✅ No TypeScript errors
- ✅ No runtime errors
- ✅ Database operations work (if `DATABASE_URL` is configured)
- ✅ Types are correctly exported and importable

## Troubleshooting

### If `verify` script fails:

1. **Check Prisma client is generated:**

   ```bash
   pnpm --filter db db:generate
   ```

2. **Check TypeScript compilation:**

   ```bash
   cd db && npx tsc --noEmit
   ```

3. **Check imports are correct:**
   - `db/client.ts` should import from `./generated/prisma/client`
   - `db/index.ts` should export from `./client` and `./generated/prisma/client`

### If cross-package import fails:

1. **Ensure `db` is in `packages/services/package.json` dependencies:**

   ```json
   {
     "dependencies": {
       "db": "workspace:*"
     }
   }
   ```

2. **Reinstall dependencies:**

   ```bash
   pnpm install
   ```

3. **Check workspace configuration in `pnpm-workspace.yaml`:**
   ```yaml
   packages:
     - "db"
     - "packages/*"
   ```

### If seed script fails:

1. **Check `.env` file exists and has `DATABASE_URL`:**

   ```bash
   cat .env | grep DATABASE_URL
   ```

2. **Check the import path in `db/prisma/seed.ts`:**
   ```typescript
   import { prisma } from "../client";
   ```

## Quick Verification Command

Run all verification steps at once:

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm --filter db db:generate

# Verify db package exports
pnpm --filter db verify

# Verify cross-package imports
pnpm --filter @koan/services test:import

# Verify seed script
pnpm --filter db seed
```

## What Changed

### Before:

- `seed.ts` imported `PrismaClient` directly and created its own instance
- No wrapper API for other packages to use
- Each package would need to configure PrismaClient separately

### After:

- `db/client.ts` provides a singleton `prisma` instance with Neon adapter configured
- `db/index.ts` re-exports `prisma` and all generated types
- `seed.ts` uses the shared `prisma` instance
- Other packages can import `{ prisma } from "db"` without configuration

## Benefits Verified

✅ **Single source of truth**: One PrismaClient instance shared across monorepo  
✅ **Clean API**: Simple `import { prisma } from "db"` for other packages  
✅ **Proper singleton**: Prevents multiple instances in development  
✅ **Centralized config**: Neon adapter setup in one place  
✅ **Type safety**: All generated types available via `import { Koan, Comment } from "db"`
