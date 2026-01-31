import fs from "node:fs/promises"
import { db } from "../services/db"

async function main() {
  const tool = await db.tool.findUnique({
    where: { slug: "listkit" },
    select: { id: true, name: true, slug: true, content: true, tagline: true, description: true },
  })

  await fs.writeFile("db-content.json", JSON.stringify(tool, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await db.$disconnect()
  })
