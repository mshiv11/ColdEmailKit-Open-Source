import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = "sainimrityunjay@gmail.com"

  console.log(`Updating user ${email} to admin...`)

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: {
      email,
      name: "Admin",
      role: "admin",
      emailVerified: true,
    },
  })

  console.log(`User ${user.email} is now ${user.role}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
