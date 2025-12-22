import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findAlternativeList } from "~/server/admin/alternatives/queries"
import { findCategoryList } from "~/server/admin/categories/queries"
import { findIntegrationList } from "~/server/admin/integrations/queries"

const CreateToolPage = () => {
  return (
    <Wrapper size="md">
      <ToolForm
        title="Create tool"
        alternativesPromise={findAlternativeList()}
        categoriesPromise={findCategoryList()}
        integrationsPromise={findIntegrationList()}
      />
    </Wrapper>
  )
}

export default withAdminPage(CreateToolPage)
