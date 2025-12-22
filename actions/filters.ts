"use server"

import { createServerAction } from "zsa"
import { findAlternatives } from "~/server/web/alternatives/queries"
import { findCategories } from "~/server/web/categories/queries"
import { findLicenses } from "~/server/web/licenses/queries"
import { findIntegrations } from "~/server/web/integrations/queries"

export const findFilterOptions = createServerAction().handler(async () => {
  const filters = await Promise.all([
    findAlternatives({}),
    findCategories({}),
    findIntegrations({}),
    findLicenses({}),
  ])

  // Map the filters to the expected format
  const [alternative, category, integration, license] = filters.map(r =>
    r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
  )

  return { alternative, category, integration, license } as const
})
