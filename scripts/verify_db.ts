import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

async function main() {
    const tools = await prisma.tool.findMany({
        where: { slug: { in: ['plusvibe-ai', 'instantly', 'mailwarm'] } },
        select: { slug: true, totalReviews: true, overallRating: true, pricingStarting: true, trustScore: true }
    });
    console.log(JSON.stringify(tools, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
