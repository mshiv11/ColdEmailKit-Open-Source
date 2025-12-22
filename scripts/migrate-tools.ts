import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const dataDir = path.join(process.cwd(), 'scripts', 'data');
if (!fs.existsSync(dataDir)) {
    console.error(`Data directory not found: ${dataDir}`);
    process.exit(1);
}

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
let tools: any[] = [];

for (const file of files) {
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    try {
        const chunk = JSON.parse(fileContent);
        if (Array.isArray(chunk)) {
            tools = [...tools, ...chunk];
        }
    } catch (e) {
        console.error(`Error parsing ${file}:`, e);
    }
}

console.log(`Found ${tools.length} tools to migrate.`);

for (const tool of tools) {
    console.log(`Processing ${tool.name}...`);

    // Map categories
    const categoryConnects = [];
    if (tool.categories && Array.isArray(tool.categories)) {
        for (const catName of tool.categories) {
            // Simple slugify
            const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            // Upsert category
            const category = await prisma.category.upsert({
                where: { slug },
                update: {},
                create: {
                    name: catName,
                    slug,
                    fullPath: slug
                }
            });
            categoryConnects.push({ id: category.id });
        }
    }

    // Upsert tool
    try {
        await prisma.tool.upsert({
            where: { slug: tool.slug },
            update: {
                name: tool.name,
                description: tool.description,
                content: tool.long_description,
                websiteUrl: tool.website,
                faviconUrl: tool.logo,
                repositoryUrl: null,
                pricingStarting: tool.pricing_starter,
                stars: 0,
                forks: 0,
                status: 'Published',
                isFeatured: tool.featured || false,
                categories: {
                    connect: categoryConnects
                }
            },
            create: {
                // Use original ID if valid CUID/UUID, or let Prisma generate
                // Since Supabase IDs are UUIDs and Prisma schema uses String @id, we can try to use them.
                // However, if there are conflicts or format issues, we might want to skip setting ID.
                // Let's try setting it.
                id: tool.id,
                name: tool.name,
                slug: tool.slug,
                description: tool.description,
                content: tool.long_description,
                websiteUrl: tool.website,
                faviconUrl: tool.logo,
                repositoryUrl: null,
                pricingStarting: tool.pricing_starter,
                status: 'Published',
                isFeatured: tool.featured || false,
                categories: {
                    connect: categoryConnects
                }
            }
        });
    } catch (error) {
        console.error(`Failed to upsert tool ${tool.name}:`, error);
    }
}
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
