import { IntegrationList } from "~/components/web/integrations/integration-list"
import { findIntegrations } from "~/server/web/integrations/queries"

export const IntegrationListing = async () => {
  const integrations = await findIntegrations({})

  return <IntegrationList integrations={integrations} showCount />
}
