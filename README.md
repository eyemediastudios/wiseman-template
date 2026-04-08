# Real Estate Starter — Astro + Sanity + Vercel

White-label real estate website template. Designed for UK estate agents.

## Stack

- **Astro** (SSG + hybrid SSR) — fast, SEO-first frontend
- **Sanity v3** — headless CMS for listings, branches, pages
- **Tailwind CSS v4** — utility-first styling via CSS custom properties
- **React islands** — interactive components (filters, gallery, map)
- **Vercel** — deployment with ISR / webhook rebuilds

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd real-estate-starter
npm install

# 2. Set up Sanity
cd sanity
npx sanity@latest init --env .env
# Deploy schemas:
npx sanity deploy

# 3. Configure environment
cp .env.example .env
# Fill in SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN

# 4. Run dev
npm run dev
```

## White-Label Setup

1. Create a new Sanity project (or dataset) per client
2. Update `siteSettings` singleton — logo, colours, name
3. Deploy to Vercel with client's custom domain
4. Set up Sanity webhook → Vercel deploy hook for auto-rebuilds

## Directory Structure

```
├── sanity/                  # Sanity Studio + schemas
│   ├── schemas/
│   │   ├── property.ts      # Main listing document
│   │   ├── branch.ts        # Office/branch locations
│   │   ├── area.ts          # Area landing pages
│   │   ├── page.ts          # CMS-managed static pages
│   │   ├── siteSettings.ts  # White-label config singleton
│   │   └── index.ts         # Schema registry
│   └── sanity.config.ts
│
├── src/
│   ├── layouts/
│   │   └── Base.astro       # HTML shell, nav, footer
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── properties/
│   │   │   ├── index.astro  # All listings grid + filters
│   │   │   └── [slug].astro # Listing detail page
│   │   ├── areas/
│   │   │   ├── index.astro  # Area index
│   │   │   └── [slug].astro # Area landing page (local SEO)
│   │   ├── contact.astro
│   │   ├── valuation.astro  # Lead gen form
│   │   └── 404.astro
│   ├── components/
│   │   ├── PropertyCard.astro
│   │   ├── PropertyGrid.astro
│   │   ├── PropertyFilter.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── MapEmbed.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Hero.astro
│   │   ├── Breadcrumbs.astro
│   │   ├── SEOHead.astro
│   │   └── EpcBadge.astro
│   ├── lib/
│   │   ├── sanity.ts        # Sanity client
│   │   ├── queries.ts       # All GROQ queries
│   │   └── utils.ts         # Price formatting, helpers
│   └── styles/
│       └── global.css
│
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
└── .env.example
```
