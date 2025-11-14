import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const authorId = "291a6f45-9ff0-4e9c-946d-e5cdae3cda76";

    const blog = await prisma.blog.create({
        data: {
            sanityId: "sanity-blog-001",
            sanitySlug: "getting-started-with-nextjs",
            authorId: authorId,
            publishedAt: new Date("2024-01-15"),
            sanityUpdatedAt: new Date("2024-01-15"),
            isApproved: true,
            approvedAt: new Date("2024-01-16"),
            genericViewCount: 42,
            verifiedViewCount: 15,
        },
    });

    console.log("✅ Seeded blog:", blog.id);
}

main()
    .catch((e) => {
        console.error("Error seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
