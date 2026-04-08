# Real Estate Starter — Astro + Sanity v5 + Vercel

White-label real estate website template. Designed for UK estate agents. Clone, configure, skin.

## Stack

- **Astro** (static output) — fast, SEO-first frontend
- **Sanity v5** — headless CMS for listings, branches, agents, areas, pages
- **Tailwind CSS v4** — utility-first styling via CSS custom properties
- **React islands** — interactive components (gallery, map, calculator, forms)
- **Vercel** — static hosting with webhook rebuilds
- **Leaflet** — map with OpenStreetMap tiles (no API key required)
- **Recharts** — mortgage calculator donut chart

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd wiseman-template
npm install

# 2. Set up Sanity Studio
cd sanity
npx sanity@latest init
# Deploy schemas:
npx sanity deploy

# 3. Configure environment
cp .env.example .env
# Fill in: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN

# 4. Run dev
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SANITY_PROJECT_ID` | Yes | Found in sanity.io/manage |
| `SANITY_DATASET` | Yes | Usually `production` |
| `SANITY_API_VERSION` | Yes | `2024-01-01` |
| `SANITY_TOKEN` | Yes | Read token from Sanity API settings |
| `PUBLIC_FORM_ENDPOINT` | No | Formspree endpoint for contact form |
| `PUBLIC_MAPBOX_TOKEN` | No | Only needed for MapEmbed (map works without it) |

## Sanity Schema

**Documents:**
- `property` — listing with images, floorplans, videos, features, location
- `branch` — office location (name, phone, email, address)
- `agent` — individual agent (photo, bio, contact, social links)
- `area` — neighbourhood landing pages for local SEO
- `page` — CMS-managed content pages
- `siteSettings` — singleton: logo, colours, site name, phone, social links

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured listings |
| `/properties` | Full listings grid with filter sidebar |
| `/properties/[slug]` | Property detail: gallery, floorplans, map, video, enquiry form |
| `/map` | Full-screen map search with sidebar filters |
| `/areas` | Area index |
| `/areas/[slug]` | Area landing page |
| `/team` | Agent team listing |
| `/team/[slug]` | Agent profile |
| `/contact` | Contact page |
| `/valuation` | Lead generation form |

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `MapSearch.tsx` | React island | Interactive map with sidebar filters, property markers, popups |
| `ImageGallery.tsx` | React island | Drag-to-reorder gallery with lightbox |
| `VideoPlayer.tsx` | React island | YouTube / Vimeo / direct upload video player |
| `FloorplansViewer.tsx` | React island | Filmstrip thumbnails + full-screen lightbox |
| `MortgageCalculator.tsx` | React island | Donut chart calculator in sidebar |
| `SimilarListings.tsx` | React island | Related properties on detail page |
| `ContactForm.tsx` | React island | Enquiry form (Formspree or mailto fallback) |
| `PropertyFilter.tsx` | React island | Price/beds/type/status filters |
| `MapEmbed.tsx` | React island | Single property location map |
| `AgentCard.astro` | Astro | Agent card used in sidebar |
| `EpcBadge.astro` | Astro | EPC rating display (A–G) |
| `Breadcrumbs.astro` | Astro | Page breadcrumb trail |

## White-Label Setup

1. Create a new Sanity project per client
2. Update `siteSettings` singleton — logo, brand colours, site name
3. Add env vars to Vercel
4. Set up Sanity webhook → Vercel deploy hook for auto-rebuilds on content publish
5. Add custom domain in Vercel settings

## Directory Structure

```
├── sanity/
│   ├── schemas/
│   │   ├── property.ts      # Listing document
│   │   ├── branch.ts       # Office/branch
│   │   ├── agent.ts        # Individual agent
│   │   ├── area.ts         # Area landing page
│   │   ├── page.ts         # CMS page
│   │   ├── siteSettings.ts  # White-label singleton
│   │   └── index.ts        # Schema registry
│   └── sanity.config.ts
│
├── src/
│   ├── layouts/
│   │   └── Base.astro       # HTML shell, nav, footer
│   ├── pages/
│   │   ├── index.astro
│   │   ├── properties/
│   │   ├── areas/
│   │   ├── team/
│   │   ├── map.astro
│   │   ├── contact.astro
│   │   └── valuation.astro
│   ├── components/
│   │   ├── PropertyCard.astro
│   │   ├── PropertyGrid.astro
│   │   ├── PropertyFilter.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── MapEmbed.tsx
│   │   ├── MapSearch.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── FloorplansViewer.tsx
│   │   ├── MortgageCalculator.tsx
│   │   ├── SimilarListings.tsx
│   │   ├── ContactForm.tsx
│   │   ├── AgentCard.astro
│   │   ├── Breadcrumbs.astro
│   │   ├── EpcBadge.astro
│   │   └── SEOHead.astro
│   ├── lib/
│   │   ├── sanity.ts
│   │   ├── queries.ts
│   │   └── utils.ts
│   └── styles/
│       └── global.css
│
├── scripts/
│   └── migrate-floorplans.cjs  # One-time migration script
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```
