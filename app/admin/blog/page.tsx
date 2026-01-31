import { allPosts } from "content-collections"
import type { Metadata } from "next"
import { BlogTable } from "~/app/admin/blog/_components/blog-table"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"

export const metadata: Metadata = {
  title: "Blog Posts | Admin",
}

const BlogAdminPage = async () => {
  // Get posts from content-collections (static MDX files)
  const posts = allPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <Wrapper size="lg">
      <BlogTable posts={posts} />
    </Wrapper>
  )
}

export default withAdminPage(BlogAdminPage)
