import { notFound } from "next/navigation"
import { IntegrationForm } from "~/app/admin/integrations/_components/integration-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findIntegrationBySlug } from "~/server/admin/integrations/queries"
import { findToolList } from "~/server/admin/tools/queries"

type PageProps = {
    params: Promise<{ slug: string }>
}

const UpdateIntegrationPage = async ({ params }: PageProps) => {
    const { slug } = await params
    const integration = await findIntegrationBySlug(slug)

    if (!integration) {
        return notFound()
    }

    return (
        <Wrapper size="md">
            <IntegrationForm
                title="Update integration"
                integration={integration}
                toolsPromise={findToolList()}
            />
        </Wrapper>
    )
}

export default withAdminPage(UpdateIntegrationPage)
