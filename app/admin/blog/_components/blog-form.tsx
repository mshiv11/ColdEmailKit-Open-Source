"use client"

import { slugify } from "@primoui/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { type ComponentProps, use } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { z } from "zod"
import { Button } from "~/components/common/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/common/form"
import { H3 } from "~/components/common/heading"
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { useComputedField } from "~/hooks/use-computed-field"
import { updateBlogPost, createBlogPost } from "~/server/admin/blog/actions"
import { cx } from "~/utils/cva"

const blogFormSchema = z.object({
    slug: z.string().min(1, "Slug is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string().optional(),
    publishedAt: z.string(),
    authorId: z.string().optional(),
    authorName: z.string().min(1, "Author name is required"),
    authorImage: z.string(),
    authorTwitter: z.string(),
    tools: z.string().optional(),
    content: z.string(),
})

type Author = {
    id: string
    name: string
    image: string | null
    twitterHandle: string | null
}

type BlogFormProps = ComponentProps<"form"> & {
    post?: {
        slug: string
        title: string
        description: string
        image?: string
        publishedAt: string
        authorName: string
        authorImage: string
        authorTwitter: string
        tools?: string[]
        content: string
    }
    authorsPromise?: Promise<Author[]>
    isNew?: boolean
}

export function BlogForm({
    children,
    className,
    post,
    authorsPromise,
    isNew = false,
    ...props
}: BlogFormProps) {
    const router = useRouter()
    const authors = authorsPromise ? use(authorsPromise) : []

    const form = useForm({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            slug: post?.slug ?? "",
            title: post?.title ?? "",
            description: post?.description ?? "",
            image: post?.image ?? "",
            publishedAt: post?.publishedAt ?? new Date().toISOString().split("T")[0],
            authorId: "",
            authorName: post?.authorName ?? "",
            authorImage: post?.authorImage ?? "",
            authorTwitter: post?.authorTwitter ?? "",
            tools: post?.tools?.join(", ") ?? "",
            content: post?.content ?? "",
        },
    })

    // Set the slug based on the title for new posts
    useComputedField({
        form,
        sourceField: "title",
        computedField: "slug",
        callback: slugify,
        enabled: isNew,
    })

    // Handle author selection from dropdown
    const handleAuthorSelect = (authorId: string) => {
        const selectedAuthor = authors.find(a => a.id === authorId)
        if (selectedAuthor) {
            form.setValue("authorId", authorId)
            form.setValue("authorName", selectedAuthor.name)
            form.setValue("authorImage", selectedAuthor.image || "")
            form.setValue("authorTwitter", selectedAuthor.twitterHandle || "")
        }
    }

    const updateAction = useServerAction(updateBlogPost, {
        onSuccess: ({ data }) => {
            toast.success("Post updated successfully")
            if (data.slug !== post?.slug) {
                router.push(`/admin/blog/${data.slug}`)
            }
        },
        onError: ({ err }) => toast.error(err.message),
    })

    const createAction = useServerAction(createBlogPost, {
        onSuccess: ({ data }) => {
            toast.success("Post created successfully")
            router.push(`/admin/blog/${data.slug}`)
        },
        onError: ({ err }) => toast.error(err.message),
    })

    const handleSubmit = form.handleSubmit(data => {
        const payload = {
            ...data,
            tools: data.tools ? data.tools.split(",").map(t => t.trim()).filter(Boolean) : [],
        }

        if (isNew) {
            createAction.execute(payload)
        } else {
            updateAction.execute(payload)
        }
    })

    const isPending = updateAction.isPending || createAction.isPending

    return (
        <Form {...form}>
            <Stack className="justify-between">
                <H3 className="flex-1 truncate">
                    {isNew ? "Create blog post" : `Edit: ${post?.title}`}
                </H3>

                {!isNew && (
                    <Button variant="secondary" size="sm" asChild>
                        <Link href={`/blog/${post?.slug}`} target="_blank">
                            View post
                        </Link>
                    </Button>
                )}
            </Stack>

            <form
                onSubmit={handleSubmit}
                className={cx("grid gap-4", className)}
                noValidate
                {...props}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={!isNew} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <TextArea {...field} rows={2} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Featured Image URL</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="/content/post-name/image.webp" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="publishedAt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Published Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Author Selection */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-4">
                    <div className="flex items-center justify-between">
                        <FormLabel className="text-base font-semibold">Author</FormLabel>
                        {authors.length > 0 && (
                            <Select onValueChange={handleAuthorSelect}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select from users..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {authors.map(author => (
                                        <SelectItem key={author.id} value={author.id}>
                                            {author.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="authorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="authorImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="/authors/name.webp" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="authorTwitter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twitter Handle</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="handle" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="tools"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Related Tools (comma-separated slugs)</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="posthog, sentry, plausible" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content (MDX)</FormLabel>
                            <FormControl>
                                <TextArea
                                    {...field}
                                    rows={20}
                                    className="font-mono text-sm"
                                    placeholder="Write your post content in MDX format..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between gap-4">
                    <Button size="md" variant="secondary" asChild>
                        <Link href="/admin/blog">Cancel</Link>
                    </Button>

                    <Button size="md" isPending={isPending}>
                        {isNew ? "Create post" : "Update post"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
