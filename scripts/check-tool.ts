import { db } from "../services/db"

async function main() {
  const tool = await db.tool.findUnique({
    where: { slug: "listkit" },
    select: { id: true, name: true, slug: true, content: true, tagline: true },
  })
  console.log("--------------------------------")
  console.log("Content:", JSON.stringify(tool?.content))
  console.log("Tagline:", JSON.stringify(tool?.tagline))
  console.log("--------------------------------")
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await db.$disconnect()
  })
