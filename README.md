# 🚀 Zen Koan API Roadmap

## Primary Goal

Build a highly reusable API service layer powered by PostgreSQL + Prisma, and implement it using two distinct API stacks (**Node/Express** and **Bun/Hono**) to compare developer experience and performance.

---

## ✅ Progress Checklist

### Phase 1: 💾 Data Layer (Foundation)
- [x] **Step 1**: Monorepo Setup
- [ ] ~~**Step 2**: PostgreSQL Initialization~~ Currently using Neon
- [x] **Step 3**: Schema Definition
- [x] **Step 4**: Migration & Seeding
- [x] **Step 5**: Generate Client & Types

### Phase 2: 🌐 REST API (Core Service & Logic)
- [ ] **Step 1**: Service Layer (`KoanService.ts`)
- [ ] **Step 2**: Express Setup
- [ ] **Step 3**: Controllers & Routes
- [ ] **Step 4**: REST Endpoints

### Phase 3: ✨ GraphQL + Bun/Hono (Versatility & Comparison Prep)
- [ ] **Step 1**: GraphQL Server
- [ ] **Step 2**: GraphQL Schema
- [ ] **Step 3**: GraphQL Resolvers
- [ ] **Step 4**: Hono Setup
- [ ] **Step 5**: Hono REST Endpoints

### Phase 4: 📈 Scaling & Analysis (Redis + Benchmarks)
- [ ] **Step 1**: Redis Caching
- [ ] **Step 2**: Performance Comparison
- [ ] **Step 3**: Documentation

---

## Phase 1: 💾 Data Layer (Foundation)

Focus: Establish the database schema, data integrity, and shared source of truth using Prisma.

### Steps

1. **Monorepo Setup**: Initialize workspaces (`pnpm` preferred). Core directories: `db/`, `packages/services/`, `apps/express-api/`, `apps/hono-api/`.
2. **PostgreSQL Initialization**: Provision PostgreSQL (Docker recommended). Configure `DATABASE_URL` in shared `.env`.
3. **Schema Definition**: Create `db/prisma/schema.prisma`. Model `Koan`, `Comment`, `Reply` with recursive `parentId` for threads; `votes: Json`; use `\n\n` as client‑agnostic paragraph delimiter.
4. **Migration & Seeding**: Run `npx prisma migrate dev`. Add `seed.ts` to insert 5 initial koans + sample threaded comments.
5. **Generate Client & Types**: Run `npx prisma generate`. Add shared TypeScript interfaces in `packages/common/types.ts` mapping Prisma models.

### Deliverable

Provisioned PostgreSQL instance + stable, version‑controlled Prisma schema.

---

## Phase 2: 🌐 REST API (Core Service & Logic)

Focus: Implement reusable database logic in a Service layer; expose via Node/Express REST.

### Steps

1. **Service Layer**: In `packages/services/KoanService.ts` implement methods: `getKoansWithThreads()`, `getKoanById()`, `createComment()`, `createReply()`. Rule: All Prisma calls live here; no HTTP concerns.
2. **Express Setup**: In `apps/express-api/` configure server + TypeScript tooling (`ts-node-dev` or build pipeline).
3. **Controllers & Routes**: Map HTTP concerns (parse `req.params`, `req.body`) and call `KoanService` methods only.
4. **REST Endpoints**: Implement:
   - `GET /api/koans`
   - `GET /api/koans/:id`
   - `POST /api/comments` (handles new comments & replies)

### Deliverable

Production‑grade REST API (Express) atop a reusable Service layer.

---

## Phase 3: ✨ GraphQL + Bun/Hono (Versatility & Comparison Prep)

Focus: Add GraphQL interface; stand up Bun/Hono REST using identical Service layer.

### Steps

1. **GraphQL Server**: Add Apollo (or Helix/Yoga) to `apps/express-api/`; mount `/graphql`.
2. **Schema**: Define types, queries, mutations aligned with `schema.prisma` + `packages/common/types.ts`.
3. **Resolvers**: Each resolver must call a `KoanService` method (no direct Prisma usage).
4. **Hono Setup**: Initialize `apps/hono-api/`; import shared `KoanService.ts`.
5. **Hono REST Endpoints**: Mirror Phase 2 endpoints in Hono.

### Deliverable

Express app offers REST + GraphQL; Bun/Hono app offers identical REST endpoints ready for performance comparison.

---

## Phase 4: 📈 Scaling & Analysis (Redis + Benchmarks)

Focus: Add caching; measure performance across runtimes.

### Steps

1. **Redis Caching**: Integrate Redis using Cache‑Aside in heavy read methods (e.g. `getKoansWithThreads()`). Reduce DB load & latency.
2. **Performance Comparison**: Benchmark (`wrk`, `autocannon`) Express vs. Hono endpoints (startup time, latency, throughput).
3. **Documentation**: Finalize `rules_and_agents.md`; add comparative analysis + architectural rationale to root `README.md`.

### Deliverable

Cached, benchmarked multi‑interface API with documented tradeoffs.

---

## Final Outcome

Highly scalable, performant, and well‑documented API featuring:

- Shared Prisma data layer
- Reusable TypeScript Service abstraction
- REST (Express + Hono) + GraphQL (Express)
- Redis caching for hot paths
- Comparative runtime analysis (Node vs. Bun)

---

## Suggested Next Artifacts

- `packages/services/KoanService.ts`
- `apps/express-api/src/routes/koans.ts`
- `apps/hono-api/src/index.ts`
- Benchmark script: `scripts/bench.sh`
- Documentation: Updated `README.md`

---

https://gemini.google.com/app/5f5c3a7628b27e64?hl=sv
