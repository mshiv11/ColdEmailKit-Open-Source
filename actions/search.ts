"use server"

import { z } from "zod"
import { createServerAction } from "zsa"
import { getMeiliIndex } from "~/services/meilisearch"
import { tryCatch } from "~/utils/helpers"

type ToolSearchResult = {
  slug: string
  name: string
  websiteUrl: string
  faviconUrl?: string
}

type AlternativeSearchResult = {
  slug: string
  name: string
  faviconUrl?: string
}

type CategorySearchResult = {
  slug: string
  name: string
  fullPath: string
}

export const searchItems = createServerAction()
  .input(z.object({ query: z.string().trim() }))
  .handler(async ({ input: { query } }) => {
    const start = performance.now()

    const { data, error } = await tryCatch(
      Promise.all([
        getMeiliIndex("tools").search<ToolSearchResult>(query, {
          attributesToRetrieve: ["slug", "name", "websiteUrl", "faviconUrl"],
          filter: ["status = 'Published'"],
          sort: ["isFeatured:desc", "score:desc"],
          limit: 10,
        }),

        getMeiliIndex("alternatives").search<AlternativeSearchResult>(query, {
          attributesToRetrieve: ["slug", "name", "faviconUrl"],
          sort: ["pageviews:desc"],
          limit: 10,
        }),

        getMeiliIndex("categories").search<CategorySearchResult>(query, {
          attributesToRetrieve: ["slug", "name", "fullPath"],
          limit: 10,
        }),
      ]),
    )

    console.log(`Search: ${Math.round(performance.now() - start)}ms`)

    if (error) {
      console.error(error)
      return
    }

    return data
  })
