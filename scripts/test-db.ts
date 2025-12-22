import { findTools } from "~/server/admin/tools/queries"
import { ToolStatus } from "@prisma/client"
import "~/server/admin/tools/actions" // Import to check for side effects/errors

async function main() {
    console.log("Testing findTools...")
    try {
        const result = await findTools({
            name: "",
            sort: [{ id: "createdAt", desc: true }],
            page: 1,
            perPage: 10,
            from: "",
            to: "",
            operator: "and",
            status: [],
        })
        console.log("Success!", result)
    } catch (error) {
        console.error("Error:", error)
    }
}

main()
