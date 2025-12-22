import { IntegrationForm } from "~/app/admin/integrations/_components/integration-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findToolList } from "~/server/admin/tools/queries"

const NewIntegrationPage = async () => {
    return (
        <Wrapper size="md">
            <IntegrationForm
                title="Create integration"
                toolsPromise={findToolList()}
            />
        </Wrapper>
    )
}

export default withAdminPage(NewIntegrationPage)
