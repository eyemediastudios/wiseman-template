---
name: wiseman-properties-project
description: Real estate starter project — Astro frontend + Sanity v5 Studio
type: project
---

## Project
- **Location:** D:\Wiseman - Web Deb design\starter build\real-estate-starter-v3\real-estate-starter
- **Stack:** Astro (static, deployed to Vercel) + Sanity v5 Studio (runs on localhost:3333)
- **Sanity project ID:** 3g6sb7og (env: SANITY_PROJECT_ID / SANITY_STUDIO_PROJECT_ID)

## Key Files

### Frontend (Astro)
- `src/lib/queries.ts` — GROQ queries; `propertyBySlugQuery` projects `photo` as full object (not flattened) so hotspot/crop works via `urlFor()`
- `src/lib/sanity.ts` — Sanity client + `urlFor()` helper using `@sanity/image-url`
- `src/components/AgentCard.astro` — compact variant for property sidebar (photo top, name/role, phone/email, WhatsApp, socials); full variant for team page
- `src/pages/properties/[slug].astro` — property detail page; sidebar has enquiry form + compact AgentCard + branch card
- `src/pages/team/[slug].astro` — agent profile; uses `urlFor()` for photo

### Sanity Studio (`sanity/`)
- `sanity/schemas/property.ts` — images field uses custom `components: { input: MultiImageUpload }` from `./MultiImageUpload`
- `sanity/schemas/MultiImageUpload.tsx` — custom image upload component (CURRENTLY BROKEN — see handoff notes below)
- `sanity/schemas/index.ts` — exports all schema types

## Current Blockers

### 1. MultiImageUpload component broken
**Error:** `Upload failed: Patch is missing "patchType"`
- `sanity/schemas/MultiImageUpload.tsx` uses `PatchEvent.from([{ type: 'set', path: [], value: ... }])`
- Sanity v5 requires `patchType` field OR using `set()` from `sanity/form`
- **Fix:** Import `set` from `sanity/form` and use `PatchEvent.from([set(newItems)])` for all onChange calls

### 2. Sanity Studio dev server
- Run with: `cd sanity && npm run dev` (starts on localhost:3333)
- If port already in use: `netstat -ano | grep 3333` then kill the process

## Agent Card Fixes (already applied)
- `src/lib/queries.ts`: Changed `photo` projection in `allAgentsQuery`, `agentBySlugQuery`, and `propertyBySlugQuery` to project full object (not flattened `{asset->{url, metadata}}`) so hotspot/crop is preserved
- `AgentCard.astro`: Compact variant uses full photo object with `urlFor(photo).width(160).height(160).fit('crop').auto('format').url()`

## Seed Scripts (scripts/)
- `seed.js` — properties, areas, branch
- `seed-agents.js` — 4 agents
- `fix-keys.js` — adds missing `_key` to portable text blocks (properties/areas)
- `fix-agent-keys.js` — fixes socialLinks array and bio portable text `_key` for agents
