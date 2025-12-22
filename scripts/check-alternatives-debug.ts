
import { db } from "~/services/db"

async function main() {
    const alternatives = await db.alternative.findMany({
        select: { slug: true },
    })
    console.log("Alternatives slugs:", alternatives.map(a => a.slug))
}

main()
