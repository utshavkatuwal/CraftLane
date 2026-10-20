import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

/* Craftlane — Development seed data
 *
 * Creates fictional development data only. Never used in production.
 * Never creates real personal information or credentials.
 *
 * Usage: npm run prisma:seed
 */

async function main() {
  console.log('Seeding development database...')

  // Create skills
  const skills = await Promise.all([
    'Web Design',
    'React Development',
    'Copywriting',
    'Digital Marketing',
    'UI/UX Design',
    'Python Development',
  ].map((name) =>
    prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
    }),
  ))

  console.log(`Created ${skills.length} skills`)

  // Create a freelancer user
  const freelancerPassword = await hash('dev-freelancer-password')
  const freelancer = await prisma.user.upsert({
    where: { email: 'freelancer@example.com' },
    update: {},
    create: {
      email: 'freelancer@example.com',
      password_hash: freelancerPassword,
      full_name: 'Alex Rivera',
      role: 'FREELANCER',
      status: 'ACTIVE',
      email_verified: true,
    },
  })

  // Create a client user
  const clientPassword = await hash('dev-client-password')
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password_hash: clientPassword,
      full_name: 'Sam Client',
      role: 'CLIENT',
      status: 'ACTIVE',
      email_verified: true,
    },
  })

  console.log('Created users:', freelancer.email, client.email)

  // Create freelancer profile
  const freelancerProfile = await prisma.freelancerProfile.upsert({
    where: { user_id: freelancer.id },
    update: {},
    create: {
      user_id: freelancer.id,
      headline: 'React Developer & UI Designer',
      bio: 'Experienced frontend developer specializing in React and modern UI design.',
      location: 'Barcelona, Spain',
      hourly_rate_cents: 7500,
      currency: 'EUR',
      availability: 'AVAILABLE',
      is_public: true,
    },
  })

  // Create client profile
  const clientProfile = await prisma.clientProfile.upsert({
    where: { user_id: client.id },
    update: {},
    create: {
      user_id: client.id,
      organization: 'Acme Corp',
      bio: 'We build digital products for modern businesses.',
      location: 'Berlin, Germany',
      is_public: true,
    },
  })

  console.log('Created profiles')

  // Link skills to freelancer profile
  for (const skill of skills.slice(0, 3)) {
    await prisma.profileSkill.create({
      where: {
        profile_id_skill_id: {
          profile_id: freelancerProfile.id,
          skill_id: skill.id,
        },
      },
      create: {
        profile_id: freelancerProfile.id,
        skill_id: skill.id,
      },
    })
  }

  console.log('Linked skills to freelancer profile')

  // Create a portfolio item
  await prisma.portfolioItem.create({
    data: {
      profile_id: freelancerProfile.id,
      title: 'E-commerce Redesign',
      description: 'Redesigned an e-commerce platform with improved checkout flow.',
      url: 'https://example.com/portfolio/ecommerce',
      thumbnail_url: 'https://example.com/portfolio/ecommerce-thumb.jpg',
    },
  })

  console.log('Created portfolio item')

  // Create a published project
  const project = await prisma.project.create({
    data: {
      client_id: clientProfile.id,
      title: 'Landing Page Design',
      description: 'Create a modern landing page for a new SaaS product.',
      status: 'PUBLISHED',
      project_type: 'FIXED_PRICE',
      budget_min_cents: 150000, // €1,500.00
      budget_max_cents: 300000, // €3,000.00
      currency: 'EUR',
      skills: {
        create: [
          { skill_id: skills[0].id }, // Web Design
          { skill_id: skills[1].id }, // React Development
        ],
      },
    },
    include: { skills: { include: { skill: true } } },
  })

  console.log('Created project:', project.title)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
