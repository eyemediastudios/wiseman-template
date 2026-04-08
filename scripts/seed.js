import { createClient } from '@sanity/client'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load .env from project root
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// Small delay between operations to avoid API rate-limit conflicts
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ─── Portable text block helper ───────────────────────────────────────────────
function pt(text) {
  return [
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text, marks: [] }], markDefs: [] },
  ]
}

// ─── Idempotent upsert (replace if exists, create if not) ─────────────────────
async function upsert(doc) {
  if (!doc._id) throw new Error(`upsert() requires _id on all documents: ${JSON.stringify(doc).slice(0, 80)}`)
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: doc._id }).catch(() => null)
  if (existing) {
    await client.createOrReplace(doc)
    return 'updated'
  } else {
    await client.create(doc)
    return 'created'
  }
}

// ─── DATA ───────────────────────────────────────────────────────────────────────

const siteSettingsData = {
  _type: 'siteSettings',
  _id: 'site-settings',
  siteName: 'Wiseman Properties',
  primaryColour: '#1a3a5c',
  secondaryColour: '#c9a84c',
  phone: '020 7946 0958',
  email: 'info@wisemanproperties.co.uk',
  footerText: '© 2024 Wiseman Properties. All rights reserved.',
  defaultMetaTitle: 'Wiseman Properties | London Estate Agent',
  defaultMetaDescription: 'Find your perfect home in London with Wiseman Properties. Expert guidance for buyers, sellers, and tenants.',
}

const branchData = {
  _type: 'branch',
  _id: 'wiseman-properties-richmond',
  name: 'Wiseman Properties - Richmond',
  slug: { _type: 'slug', current: 'wiseman-properties-richmond' },
  address: '42 King Street, Richmond, Surrey TW9 1ND',
  phone: '020 8948 6621',
  email: 'richmond@wisemanproperties.co.uk',
  openingHours: 'Mon\u2013Fri: 9am\u20136pm\nSat: 10am\u20134pm\nSun: 11am\u20133pm',
  location: { _type: 'geopoint', lat: 51.4613, lng: -0.3038 },
}

const areasData = [
  {
    _type: 'area',
    _id: 'area-richmond',
    name: 'Richmond',
    slug: { _type: 'slug', current: 'richmond' },
    description: pt('Richmond upon Thames is one of London\'s most prestigious suburbs, celebrated for its expansive riverside parks, outstanding schools, and vibrant high street. Residents enjoy immediate access to Richmond Park \u2014 one of London\'s largest royal parks \u2014 as well as the scenic Thames Path running alongside the river. The area boasts excellent transport links, with Richmond station providing direct connections to London Waterloo, and a superb selection of independent boutiques, restaurants, and cafes along cobbled Hill Street and the Quadrangle. Families are drawn to the area for its choice of Outstanding-rated primary and secondary schools, while the Theatre Royal Richmond and the historic Kew Gardens provide rich cultural attractions. With a strong sense of community and an enviable quality of life, Richmond remains one of south-west London\'s most sought-after addresses.'),
    metaTitle: 'Homes for Sale & Rent in Richmond | Wiseman Properties',
    metaDescription: 'Discover properties for sale and to rent in Richmond upon Thames. Wiseman Properties offers expert guidance on buying, selling, and letting in this prestigious London suburb.',
  },
  {
    _type: 'area',
    _id: 'area-clapham',
    name: 'Clapham',
    slug: { _type: 'slug', current: 'clapham' },
    description: pt('Clapham has become one of south London\'s most desirable neighbourhoods, particularly popular among young professionals and families seeking a balanced urban lifestyle. The area centres on the Common \u2014 a vast 200-acre open space perfect for running, cycling, and weekend picnics \u2014 alongside the picturesque Holy Trinity Clapham Parish Church. Clapham Junction station offers one of the busiest rail connections in Europe, with swift access to Victoria, Waterloo, and the City, while the Northern line extension has only strengthened its appeal. The vibrant high street hosts an eclectic mix of artisan coffee shops, gastropubs, fitness studios, and independent retailers. Excellent state and independent schooling makes Clapham a firm favourite for families, while the lively nightlife scene around Abbeville Road draws a diverse crowd.'),
    metaTitle: 'Homes for Sale & Rent in Clapham | Wiseman Properties',
    metaDescription: 'Find your perfect property in Clapham. From flats to family houses, Wiseman Properties covers buying, selling, and renting in this vibrant south London neighbourhood.',
  },
  {
    _type: 'area',
    _id: 'area-ealing',
    name: 'Ealing',
    slug: { _type: 'slug', current: 'ealing' },
    description: pt('Ealing is a west London suburb undergoing significant transformation, combining Edwardian architectural grandeur with a thriving multicultural identity and an increasingly dynamic food and entertainment scene. The Broadway shopping centre and the charming Haven Green area provide excellent local amenities, while the historic film heritage \u2014 Ealing Studios is the world\'s oldest film studios \u2014 underlines the area\'s creative character. Families are well-served by a strong selection of Ofsted Outstanding and Good schools, and the area is particularly popular for its relative value compared to neighbouring Notting Hill and Kensington. Transport links via the Elizabeth line have reduced journey times to central London dramatically, making Ealing an increasingly smart choice for commuters.'),
    metaTitle: 'Homes for Sale & Rent in Ealing | Wiseman Properties',
    metaDescription: 'Explore properties for sale and to rent in Ealing. Wiseman Properties provides expert advice on buying, selling, and letting in this vibrant west London neighbourhood.',
  },
]

const propertiesData = [
  {
    title: '4 Bedroom Detached House, Queens Road, Richmond',
    slug: { _type: 'slug', current: '4-bedroom-detached-house-queens-road-richmond' },
    status: 'for-sale',
    propertyType: 'Detached',
    price: 1850000,
    priceQualifier: 'Guide Price',
    bedrooms: 4,
    bathrooms: 3,
    receptionRooms: 2,
    sqft: 2847,
    tenure: 'Freehold',
    epc: 'C',
    councilTaxBand: 'G',
    description: pt('This impressive four-bedroom detached family home occupies a generous plot on one of Richmond\'s most prestigious roads, just a short stroll from Richmond Park. The ground floor boasts two formal reception rooms, a contemporary open-plan kitchen and breakfast room with bi-fold doors leading onto the rear garden, and a utility room. The first floor presents a principal bedroom suite with en-suite bathroom and walk-in wardrobe, three further double bedrooms (one with en-suite), and a family bathroom. The property benefits from a private rear garden extending to approximately 60 feet, a detached double garage, and off-street parking for multiple vehicles. An exceptional opportunity in a highly prized location.'),
    features: ['Approximately 2,847 sq ft of flexible accommodation', 'Private 60-foot rear garden', 'Detached double garage with off-street parking', 'Principal suite with en-suite bathroom and walk-in wardrobe', 'Moments from Richmond Park'],
    addressLine1: '42 Queens Road',
    town: 'Richmond',
    county: 'Surrey',
    postcode: 'TW10 6AS',
    location: { _type: 'geopoint', lat: 51.4347, lng: -0.2861 },
  },
  {
    title: '3 Bedroom Semi-Detached House, Ashbourne Road, Ealing',
    slug: { _type: 'slug', current: '3-bedroom-semi-detached-house-ashbourne-road-ealing' },
    status: 'for-sale',
    propertyType: 'Semi-Detached',
    price: 975000,
    priceQualifier: 'Guide Price',
    bedrooms: 3,
    bathrooms: 2,
    receptionRooms: 2,
    sqft: 1650,
    tenure: 'Freehold',
    epc: 'D',
    councilTaxBand: 'E',
    description: pt('An elegant late-Victorian semi-detached house situated on a popular residential road close to Ealing Common and the array of shops and restaurants along Pitshanger Lane. The property has been thoughtfully modernised throughout, retaining a host of original period features including stripped wooden floors, original fireplaces, and high ceilings. The ground floor comprises a double reception room with feature fireplace, a separate dining room, and a modern kitchen with granite worktops. Upstairs are three well-proportioned bedrooms and a stylish family bathroom. The rear garden extends to approximately 50 feet and benefits from a paved terrace ideal for summer entertaining. Ealing Broadway and the Elizabeth line provide excellent transport connections.'),
    features: ['Original Victorian period features throughout', 'Private 50-foot rear garden with paved terrace', 'Double reception room with original fireplace', 'Modern kitchen with granite worktops', 'Excellent transport links via Elizabeth line'],
    addressLine1: '28 Ashbourne Road',
    town: 'Ealing',
    county: 'London',
    postcode: 'W5 4EH',
    location: { _type: 'geopoint', lat: 51.5130, lng: -0.3007 },
  },
  {
    title: '2 Bedroom Flat, Abbeville Road, Clapham',
    slug: { _type: 'slug', current: '2-bedroom-flat-abbeville-road-clapham' },
    status: 'for-sale',
    propertyType: 'Flat',
    price: 625000,
    priceQualifier: 'Guide Price',
    bedrooms: 2,
    bathrooms: 1,
    receptionRooms: 1,
    sqft: 895,
    tenure: 'Leasehold',
    epc: 'C',
    councilTaxBand: 'D',
    description: pt('A beautifully presented two-bedroom first-floor flat occupying the upper levels of a handsome late-Victorian terrace on the desirable Abbeville Road. The property has been sympathetically updated by the current owners and offers a bright and airy feel throughout. The reception room is a particular highlight, with high ceilings, a wide bay window, and exposed brick fireplace. There are two generous double bedrooms and a sleek bathroom with Metro-inspired tiling. The flat sits moments from the boutiques and eateries of Abbeville Road, a short walk from Clapham Common, and under ten minutes from Clapham South tube station.'),
    features: ['Bay-fronted reception room with high ceilings', 'Two generous double bedrooms', 'Moments from Abbeville Road shops and restaurants', 'Short walk from Clapham Common', 'Under ten minutes from Clapham South tube station'],
    addressLine1: '75 Abbeville Road',
    town: 'Clapham',
    county: 'London',
    postcode: 'SW4 9LQ',
    location: { _type: 'geopoint', lat: 51.4571, lng: -0.1408 },
  },
  {
    title: '5 Bedroom Terraced House, New Kings Road, Fulham',
    slug: { _type: 'slug', current: '5-bedroom-terraced-house-new-kings-road-fulham' },
    status: 'for-sale',
    propertyType: 'Terraced',
    price: 2150000,
    priceQualifier: 'Offers Over',
    bedrooms: 5,
    bathrooms: 4,
    receptionRooms: 3,
    sqft: 3220,
    tenure: 'Freehold',
    epc: 'B',
    councilTaxBand: 'H',
    description: pt('Superb five-bedroom family house arranged over four floors, located on New Kings Road \u2014 one of Fulham\'s most sought-after addresses. The ground floor offers a double reception room, a large open-plan kitchen and family room with engineered oak floors and a marble island, and direct garden access via a full-width glass conservatory. The first floor comprises four bedrooms (including the principal suite with dressing room and en-suite bathroom), a family bathroom, and a guest WC. The top floor provides a fifth bedroom with en-suite and a versatile media room. The south-facing garden is approximately 45 feet and features a detached home office with power and internet. The property is within the catchment area for several Outstanding-rated schools.'),
    features: ['Four/five reception rooms across four floors', 'Open-plan kitchen and family room with marble island', 'South-facing 45-foot garden with detached home office', 'Principal suite with dressing room and en-suite bathroom', 'Catchment area for Outstanding-rated schools'],
    addressLine1: '118 New Kings Road',
    town: 'Fulham',
    county: 'London',
    postcode: 'SW6 4NG',
    location: { _type: 'geopoint', lat: 51.4760, lng: -0.1705 },
  },
  {
    title: '1 Bedroom Flat, The Broadway, Wimbledon',
    slug: { _type: 'slug', current: '1-bedroom-flat-the-broadway-wimbledon' },
    status: 'for-rent',
    propertyType: 'Flat',
    price: 1850,
    priceQualifier: 'Fixed Price',
    bedrooms: 1,
    bathrooms: 1,
    receptionRooms: 1,
    sqft: 580,
    tenure: 'Leasehold',
    epc: 'B',
    councilTaxBand: 'C',
    description: pt('A bright and well-proportioned one-bedroom flat situated on the second floor of this modern development in the heart of Wimbledon. The property offers a generous open-plan reception and kitchen with a full range of integrated appliances and stone worktops, a good-sized double bedroom with built-in wardrobes, and a sleek bathroom with walk-in rainfall shower. Residents benefit from a concierge service, an on-site gym, and a communal roof terrace with views over Wimbledon. The flat is ideally positioned for Wimbledon village with its array of shops, restaurants, and boutiques, and is a short walk from Wimbledon station (District line and rail) and the iconic All England Lawn Tennis Club.'),
    features: ['Concierge service and on-site gym', 'Communal roof terrace with Wimbledon views', 'Open-plan reception and kitchen with integrated appliances', 'Built-in wardrobes in double bedroom', 'Short walk from Wimbledon station and village'],
    addressLine1: 'Flat 14, Devonshire House, The Broadway',
    town: 'Wimbledon',
    county: 'London',
    postcode: 'SW19 1QL',
    location: { _type: 'geopoint', lat: 51.4214, lng: -0.2063 },
  },
  {
    title: '3 Bedroom Maisonette, Lower Richmond Road, Putney',
    slug: { _type: 'slug', current: '3-bedroom-maisonette-lower-richmond-road-putney' },
    status: 'for-rent',
    propertyType: 'Maisonette',
    price: 3200,
    priceQualifier: 'Fixed Price',
    bedrooms: 3,
    bathrooms: 2,
    receptionRooms: 1,
    sqft: 1350,
    tenure: 'Share of Freehold',
    epc: 'D',
    councilTaxBand: 'E',
    description: pt('Exceptional three-bedroom split-level maisonette occupying the ground and lower-ground floors of this handsome Edwardian property on Lower Richmond Road, directly opposite Putney Lower Common. The property has been recently refurbished to a high standard throughout and features a large double-aspect reception room with original wooden floors and a cast-iron fireplace, a separate dining room or optional third bedroom, and a newly fitted kitchen with integrated Siemens appliances. All three bedrooms are well-proportioned doubles, and there are two bathrooms \u2014 one en-suite to the principal bedroom. The private rear garden measures approximately 35 feet and is laid to lawn with a patio seating area. Pets considered. Share of freehold.'),
    features: ['Split-level Edwardian maisonette with private 35-foot garden', 'Recent high-specification refurbishment throughout', 'Double-aspect reception room with original wooden floors', 'Share of freehold \u2014 no ground rent', 'Directly opposite Putney Lower Common'],
    addressLine1: '76 Lower Richmond Road',
    town: 'Putney',
    county: 'London',
    postcode: 'SW15 1RN',
    location: { _type: 'geopoint', lat: 51.4655, lng: -0.2113 },
  },
]

// ─── SEED ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 Starting Sanity seed...\n')

  // 1. Site Settings (singleton — idempotent via _id)
  console.log('📄 Site Settings...')
  const ssResult = await upsert(siteSettingsData)
  console.log(`  ✓ Site Settings ${ssResult}`)

  // 2. Branch (idempotent via _id)
  console.log('\n📄 Branch...')
  const brResult = await upsert(branchData)
  console.log(`  ✓ Branch ${brResult}`)

  // 3. Areas (idempotent via _id)
  console.log('\n📄 Areas...')
  for (const area of areasData) {
    const arResult = await upsert(area)
    console.log(`  ✓ Area:${area.name} ${arResult}`)
  }

  // Brief delay so references resolve before properties reference the branch
  await delay(1500)

  // 4. Properties (idempotent via _id, reference branch by _id)
  console.log('\n📄 Properties...')
  for (const prop of propertiesData) {
    const propId = `prop-${prop.slug.current}`
    const doc = { ...prop, _type: 'property', _id: propId, branch: { _type: 'reference', _ref: 'wiseman-properties-richmond' } }
    const prResult = await upsert(doc)
    console.log(`  ✓ property:${prop.slug.current} ${prResult}`)
    // Brief delay between each property to avoid rate-limit geopoint conflicts
    await delay(1500)
  }

  console.log('\n✅ Seed complete!\n')
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
