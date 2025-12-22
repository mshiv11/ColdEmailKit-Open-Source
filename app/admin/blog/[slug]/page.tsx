import { notFound } from "next/navigation"
import { BlogForm } from "~/app/admin/blog/_components/blog-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { readBlogPost } from "~/server/admin/blog/actions"
import { findAuthorList } from "~/server/admin/users/queries"

type PageProps = {
    params: Promise<{ slug: string }>
}

const EditBlogPostPage = async ({ params }: PageProps) => {
    const { slug } = await params
    const postData = await readBlogPost(slug)

    if (!postData) {
        return notFound()
    }

    const authorsPromise = findAuthorList()
    const { frontmatter, content } = postData
    const author = frontmatter.author as { name: string; image: string; twitterHandle: string } | undefined

    const post = {
        slug,
        title: String(frontmatter.title || ""),
        description: String(frontmatter.description || ""),
        image: frontmatter.image ? String(frontmatter.image) : undefined,
        publishedAt: String(frontmatter.publishedAt || new Date().toISOString().split("T")[0]),
        authorName: author?.name || "",
        authorImage: author?.image || "",
        authorTwitter: author?.twitterHandle || "",
        tools: frontmatter.tools as string[] | undefined,
        content,
    }

    return (
        <Wrapper size="md">
            <BlogForm post={post} authorsPromise={authorsPromise} />
        </Wrapper>
    )
}

export default withAdminPage(EditBlogPostPage)
