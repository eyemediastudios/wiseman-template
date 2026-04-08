import {createClient} from '@sanity/client'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({path: join(__dirname, '..', '.env')})

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// Generate a random 12-character alphanumeric key
function generateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''
  for (let i = 0; i < 12; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return key
}

// Build a portable text array from paragraphs, each block gets a _key
function pt(...paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    style: 'normal',
    _key: generateKey(),
    children: [{_type: 'span', _key: generateKey(), text, marks: []}],
    markDefs: [],
  }))
}

const agentsData = [
  {
    name: 'Sarah Mitchell',
    role: 'Branch Manager',
    specialisms: ['Residential Sales', 'Luxury Homes', 'Valuations'],
    phone: '020 7946 0001',
    email: 'sarah@wisemanproperties.co.uk',
    whatsapp: '447700900001',
    socialLinks: [{platform: 'LinkedIn', url: 'https://linkedin.com/in/sarahmitchell'}],
    order: 1,
    bio: pt(
      'Sarah Mitchell has been managing the Wiseman Properties Richmond branch for over a decade, guiding hundreds of clients through successful sales in some of south-west London\'s most competitive markets. Known for her calm authority and deep local knowledge, she has built a reputation for achieving optimal results in both rising and correcting markets.',
      'Sarah specialises in luxury homes and high-value residential sales across Richmond, Twickenham, and the surrounding boroughs. She holds a Diploma in Property Valuation and is a member of the Royal Institution of Chartered Surveyors, bringing an analytical rigor to every valuation that her clients find invaluable.'
    ),
  },
  {
    name: 'James Carter',
    role: 'Senior Negotiator',
    specialisms: ['Residential Sales', 'First-Time Buyers'],
    phone: '020 7946 0002',
    email: 'james@wisemanproperties.co.uk',
    whatsapp: '447700900002',
    socialLinks: [{platform: 'Instagram', url: 'https://instagram.com/jamescarterwprops'}],
    order: 5,
    bio: pt(
      'James Carter joined Wiseman Properties as a graduate trainee and has rapidly established himself as one of the most proactive negotiators in the Clapham and Balham markets. His natural affinity for communication and his determination to find the right outcome for both buyers and sellers have earned him a loyal client following.',
      'With a particular focus on first-time buyers, James understands the excitement and anxiety that come with purchasing a first property. He works tirelessly to demystify the process, offering clear guidance on mortgage products, stamp duty, and the conveyancing timeline from instruction through to completion.'
    ),
  },
  {
    name: 'Priya Patel',
    role: 'Lettings Manager',
    specialisms: ['Lettings', 'Property Management', 'HMOs'],
    phone: '020 7946 0003',
    email: 'priya@wisemanproperties.co.uk',
    whatsapp: '447700900003',
    socialLinks: [{platform: 'LinkedIn', url: 'https://linkedin.com/in/priyapatelwprops'}],
    order: 3,
    bio: pt(
      'Priya Patel oversees all lettings activity at Wiseman Properties, managing a portfolio that spans studio flats to large-family homes across Ealing, Acton, and Shepherd\'s Bush. She brings meticulous organisational skills to every tenancy, ensuring landlords receive comprehensive tenant screening reports and regular property updates.',
      'In addition to standard lettings, Priya has developed a specialist HMO management service for landlords with multi-let properties, navigating the complex licensing requirements across the London boroughs. She is a member of the Association of Residential Letting Agents and holds the Level 3 Certificate in Lettings and Property Management.',
      'With an increasing number of corporate clients seeking quality rental stock in the area, Priya has built strong relationships with relocaton agencies and relocation management companies who trust her to deliver high-quality tenants consistently.'
    ),
  },
  {
    name: 'Tom Williams',
    role: 'Negotiator',
    specialisms: ['New Builds', 'Residential Sales'],
    phone: '020 7946 0004',
    email: 'tom@wisemanproperties.co.uk',
    order: 10,
    bio: pt(
      'Tom Williams is a rising star at Wiseman Properties, joining from a background in new-build residential sales with a major housebuilder. He brings excellent knowledge of off-plan developments, shared ownership schemes, and the latest government incentives available to homebuyers, making him a sought-after adviser for clients at all budget levels.',
      'Tom works primarily across Fulham, Wandsworth, and the wider south-west London market, where he is rapidly building a reputation for his honest, no-pressure approach and his ability to match buyers with properties that genuinely suit their long-term plans rather than simply closing a transaction.'
    ),
  },
]

async function upsertAgent(agent, branchRef) {
  const slug = agent.name.toLowerCase().replace(/\s+/g, '-')
  const doc = {
    _type: 'agent',
    _id: `agent-${slug}`,
    name: agent.name,
    slug: {_type: 'slug', current: slug},
    role: agent.role,
    specialisms: agent.specialisms,
    phone: agent.phone,
    email: agent.email,
    whatsapp: agent.whatsapp || null,
    socialLinks: agent.socialLinks || [],
    order: agent.order,
    active: true,
    bio: agent.bio,
    branch: {_type: 'reference', _ref: branchRef},
  }

  const existing = await client.fetch(`*[_id == $id][0]._id`, {id: doc._id})
  if (existing) {
    await client.createOrReplace(doc)
    return 'updated'
  } else {
    await client.create(doc)
    return 'created'
  }
}

async function main() {
  console.log('\n🌱 Seeding agents...\n')

  // Find the first branch
  const branch = await client.fetch(`*[_type == "branch"][0]{_id}`)
  if (!branch) {
    console.error('❌ No branch found. Run the seed script first (scripts/seed.js).')
    process.exit(1)
  }
  console.log(`  Found branch: ${branch._id}\n`)

  let fixed = 0
  for (const agent of agentsData) {
    const result = await upsertAgent(agent, branch._id)
    console.log(`  ✅ ${agent.name} (${agent.role}) — ${result}`)
    fixed++
  }

  console.log(`\n✅ Seeded ${fixed} agents.\n`)
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
