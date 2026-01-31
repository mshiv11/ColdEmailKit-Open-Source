import { BlogForm } from "~/app/admin/blog/_components/blog-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findAuthorList } from "~/server/admin/users/queries"

const NewBlogPostPage = async () => {
  const authorsPromise = findAuthorList()

  return (
    <Wrapper size="md">
      <BlogForm isNew authorsPromise={authorsPromise} />
    </Wrapper>
  )
}

export default withAdminPage(NewBlogPostPage)
