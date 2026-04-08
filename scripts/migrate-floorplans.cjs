/**
 * One-time migration: converts old single floorplan field to new floorplans array.
 * Run: node scripts/migrate-floorplans.cjs
 */
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '3g6sb7og',
  dataset: 'production',
  token: process.env.SANITY_TOKEN || 'sk3oOs5QxMESwU1JnrJI15iEQLmJzfNGMVaSnmOsbiGfsg7mcpBb9WpSDRYcOoRUdNHVKgV9wMT8yElG8DveWbjOE2KJIMtgmBoYH39A25Q0lrdMY4rsNCAl7bkMh50cTzICEVOsTSvxwuV1HjBMo3T9CkOW4zrfEw8JEAFmfJuxCs7b5Fma',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function main() {
  // Find properties that have the OLD floorplan field (not floorplans array)
  const properties = await client.fetch(`
    *[_type == "property" && defined(floorplan) && !defined(floorplans)] {
      _id,
      title,
      "floorplanRef": floorplan.asset._ref
    }
  `);

  if (!properties.length) {
    console.log('No properties need migrating.');
    return;
  }

  console.log('Found ' + properties.length + ' properties to migrate:');
  for (const p of properties) {
    console.log('  - ' + p.title + ' (ref: ' + p.floorplanRef + ')');
  }

  for (const p of properties) {
    if (!p.floorplanRef) {
      console.log('  [skip] ' + p.title + ' — no floorplan ref');
      continue;
    }

    console.log('Migrating: ' + p.title + '...');
    await client.patch(p._id).set({
      floorplans: [
        {
          _type: 'floorplanItem',
          _key: 'ground-floor',
          label: 'Ground Floor',
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: p.floorplanRef,
            },
          },
        },
      ],
      // Clear old floorplan field
      floorplan: null,
    }).commit();
    console.log('  OK');
  }

  console.log('Migration complete!');
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
