import 'dotenv/config'
import prisma from '../src/lib/prisma'

async function main() {
  await prisma.schedule.deleteMany()
  await prisma.project.deleteMany()
  await prisma.customer.deleteMany()

  const customer = await prisma.customer.create({
    data: {
      name: 'Google Space',
      contact: 'hello@google.com',
      projects: {
        create: [
          {
            name: 'Lunar Landing Page',
            numberOfUsersForBilling: 5,
            schedules: {
              create: [
                {
                  type: 'dev',
                  date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (overdue)
                  status: 'completed',
                },
                {
                  type: 'delivery',
                  date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now (this week)
                  status: 'pending',
                },
                {
                  type: 'payment',
                  date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now (upcoming)
                  status: 'pending',
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log({ customer })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
