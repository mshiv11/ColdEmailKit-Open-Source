import wretch from "wretch"
import { env } from "~/env"
import { getErrorMessage } from "~/lib/handle-error"
import { tryCatch } from "~/utils/helpers"

type JinaResponse = {
  data: {
    title: string
    description: string
    url: string
    content: string
  }
}

/**
 * Scrapes a website and returns the scraped data using Jina.ai's Reader API.
 * The Reader API expects the URL to be appended to the path: https://r.jina.ai/<url>
 * @param url The URL of the website to scrape.
 * @returns The scraped data.
 */
export const scrapeWebsiteData = async (url: string) => {
  // Jina Reader API: append target URL to the path
  let jinaApi = wretch(`https://r.jina.ai/${url}`).headers({
    Accept: "application/json",
    "X-Return-Format": "markdown",
  })

  if (env.JINA_API_KEY) {
    jinaApi = jinaApi.auth(`Bearer ${env.JINA_API_KEY}`)
  }

  const { data, error } = await tryCatch(jinaApi.get().json<JinaResponse>())

  if (error) {
    console.error("Jina API error:", error)
    throw new Error(getErrorMessage(error))
  }

  return data.data
}
