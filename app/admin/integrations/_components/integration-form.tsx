"use client"

import { slugify } from "@primoui/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { IntegrationType } from "@prisma/client"
import { useRouter } from "next/navigation"
import { type ComponentProps, use } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { IntegrationActions } from "~/app/admin/integrations/_components/integration-actions"
import { RelationSelector } from "~/components/admin/relation-selector"
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
import { upsertIntegration } from "~/server/admin/integrations/actions"
import type { findIntegrationBySlug } from "~/server/admin/integrations/queries"
import { integrationSchema } from "~/server/admin/integrations/schema"
import type { findToolList } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"

type IntegrationFormProps = ComponentProps<"form"> & {
    integration?: Awaited<ReturnType<typeof findIntegrationBySlug>>
    toolsPromise: ReturnType<typeof findToolList>
}

const integrationTypes = Object.values(IntegrationType)

export function IntegrationForm({
    children,
    className,
    title,
    integration,
    toolsPromise,
    ...props
}: IntegrationFormProps) {
    const router = useRouter()
    const tools = use(toolsPromise)

    const form = useForm({
        resolver: zodResolver(integrationSchema),
        defaultValues: {
            name: integration?.name ?? "",
            slug: integration?.slug ?? "",
            type: integration?.type ?? IntegrationType.Language,
            description: integration?.description ?? "",
            website: integration?.website ?? "",
            faviconUrl: integration?.faviconUrl ?? "",
            tools: integration?.tools.map(t => t.id) ?? [],
        },
    })

    // Set the slug based on the name
    useComputedField({
        form,
        sourceField: "name",
        computedField: "slug",
        callback: slugify,
        enabled: !integration,
    })

    // Upsert integration
    const upsertAction = useServerAction(upsertIntegration, {
        onSuccess: ({ data }) => {
            toast.success(`Integration successfully ${integration ? "updated" : "created"}`)

            // If not updating, or slug has changed, redirect to the new integration
            if (!integration || data.slug !== integration?.slug) {
                router.push(`/admin/integrations/${data.slug}`)
            }
        },

        onError: ({ err }) => toast.error(err.message),
    })

    const handleSubmit = form.handleSubmit(data => {
        upsertAction.execute({ id: integration?.id, ...data })
    })

    return (
        <Form {...form}>
            <Stack className="justify-between">
                <H3 className="flex-1 truncate">{title}</H3>

                <Stack size="sm" className="-my-0.5">
                    {integration && <IntegrationActions integration={integration} size="md" />}
                </Stack>
            </Stack>

            <form
                onSubmit={handleSubmit}
                className={cx("grid gap-4 @sm:grid-cols-2", className)}
                noValidate
                {...props}
            >
                <div className="grid gap-4 @sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input data-1p-ignore {...field} />
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
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {integrationTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                                <Input type="url" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="faviconUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Favicon URL</FormLabel>
                            <FormControl>
                                <Input type="url" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <TextArea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tools"
                    render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel>Tools</FormLabel>
                            <RelationSelector
                                relations={tools}
                                selectedIds={field.value ?? []}
                                setSelectedIds={field.onChange}
                            />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between gap-4 col-span-full">
                    <Button size="md" variant="secondary" asChild>
                        <Link href="/admin/integrations">Cancel</Link>
                    </Button>

                    <Button size="md" isPending={upsertAction.isPending}>
                        {integration ? "Update integration" : "Create integration"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
