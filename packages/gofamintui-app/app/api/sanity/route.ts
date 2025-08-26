// app/api/sanity-webhook/route.ts - COMPLETE FILE
import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { Author } from "@/sanity/interfaces/author";
import { SanityImage } from "@/sanity/interfaces/sanityImage";
import { PortableTextBlock } from "@portabletext/react";
import { prisma } from "@/lib/prisma/prisma";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { authorQuery } from "@/sanity/queries/author";
import {
  sendAuthorApprovedEmail,
  sendAuthorRevokedEmail,
} from "@/lib/email/emailHandler";
import { revalidateTag } from "next/cache";

// Use a single webhook secret for both document types
const secret = process.env.SANITY_WEBHOOK_SECRET!;

//todo: I need some more revalidating here man, come back later bro

// Blog webhook payload interface
interface BlogWebHookPayload {
  excerpt: string;
  _id: string;
  title: string;
  _type: "blogPost";
  author: {
    _type: "reference";
    _ref: string;
  };
  isApprovedToBePublished: boolean;
  _createdAt: string;
  _system: {
    base: {
      id: string;
      rev: string;
    };
  };
  _rev: string;
  _updatedAt: string;
  authorDatabaseReferenceId: string;
  readingTime: number;
  updatedAt: string;
  publishedAt: string;
  featuredImage: SanityImage;
  content: PortableTextBlock[];
  createdAt: string;
  slug: {
    _type: "slug";
    current: string;
  };
  seo: {
    title: string;
    ogImage: {
      alt: string;
      _type: "image";
      asset: {
        _type: string;
        _ref: string;
      };
    };
    description: string;
  };
}

export interface CheckBlogStatusResponse {
  _id: string;
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  authorDatabaseReferenceId: string;
  author?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    application?: {
      status?: string;
      isApproved?: boolean;
    };
  };
  featuredImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  excerpt?: string;
  content?: PortableTextBlock[];
  publishedAt?: string;
  isApprovedToBePublished: boolean;
  readingTime?: number;
  seo: {
    title: string;
    description: string;
    ogImage: {
      asset: {
        _id: string;
        url: string;
      };
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

// Union type for webhook payload
type WebhookPayload = Author | BlogWebHookPayload;

async function readBody(
  readable: ReadableStream<Uint8Array> | null
): Promise<string> {
  if (!readable) return "";

  const chunks: Buffer[] = [];
  const reader = readable.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks).toString("utf8");
}

// UPDATED: Author handling logic with orphaned blogs approach
async function handleAuthorWebhook(authorData: Author) {
  console.log(
    `📝 Processing author: ${authorData.firstName} ${authorData.lastName} (${authorData._id})`
  );

  const isDocumentStillExistingInSanity = await sanityFetchWrapper<Author>(
    authorQuery,
    { userId: authorData.userId }
  );

  console.log(isDocumentStillExistingInSanity, "logged this out");

  if (isDocumentStillExistingInSanity) {
    // Check if author exists in local DB
    const existingAuthorInDb = await prisma.author.findUnique({
      where: { userId: authorData.userId },
    });

    if (isDocumentStillExistingInSanity.application.isApproved) {
      console.log(
        `Author approved: ${authorData.firstName} ${authorData.lastName} (${authorData._id})`
      );

      // Only create if doesn't exist in DB (prevent duplicates)
      if (!existingAuthorInDb) {
        try {
          const result = await prisma.$transaction(async (tx) => {
            const newAuthor = await tx.author.create({
              data: {
                userId: isDocumentStillExistingInSanity.userId,
                ...(authorData.requestedAt && {
                  createdAt: new Date(authorData.requestedAt),
                }),
              },
            });

            // RESTORE: Re-link any orphaned blogs back to this author
            // Find blogs that match this author's userId but currently have no author
            const orphanedBlogs = await tx.blog.findMany({
              where: {
                authorId: null,
                // Add any additional conditions here to identify blogs originally by this author
                // You might want to add a field like 'originalAuthorUserId' for this purpose
              },
            });

            if (orphanedBlogs.length > 0) {
              await tx.blog.updateMany({
                where: {
                  id: { in: orphanedBlogs.map((blog) => blog.id) },
                },
                data: { authorId: newAuthor.id },
              });
              console.log(
                `🔗 Re-linked ${orphanedBlogs.length} orphaned blogs to restored author`
              );
            }

            const updatedUser = await tx.user.update({
              where: { id: isDocumentStillExistingInSanity.userId },
              data: { isAuthor: true },
            });

            return { newAuthor, updatedUser };
          });

          if (result) {
            console.log("✅ Author approved and blogs restored");
            await sendAuthorApprovedEmail(
              isDocumentStillExistingInSanity.email,
              isDocumentStillExistingInSanity.firstName
            );

            // Revalidate author-related pages
            revalidateTag("authors");
            revalidateTag("blogs");

            return {
              success: true,
              message: "Author approved and processed",
              operation: "AUTHOR_APPROVED",
            };
          }
        } catch (dbError) {
          console.error("Failed to save author to local DB:", dbError);
          throw new Error("Failed to process author in local DB");
        }
      } else {
        console.log("✅ Author already approved and exists in DB");
        return {
          success: true,
          message: "Author already approved and in database",
          operation: "AUTHOR_ALREADY_APPROVED",
        };
      }

      //todo: implement for blogs  revalidatePath(`/${issueNumber}`);
    } else {
      // Author exists in Sanity but is NOT approved (SUSPENDED)
      console.log(
        `Author suspended: ${authorData.firstName} ${authorData.lastName} - orphaning their blogs`
      );

      // If author exists in DB but is no longer approved, SUSPEND them
      if (existingAuthorInDb) {
        try {
          await prisma.$transaction(async (tx) => {
            // Get count of blogs before orphaning
            const blogCount = await tx.blog.count({
              where: { authorId: authorData.userId },
            });

            // ORPHAN their blogs (set authorId to null) - blogs remain readable
            await tx.blog.updateMany({
              where: { authorId: authorData.userId },
              data: {
                authorId: null, // Orphan the blogs
                sanityUpdatedAt: new Date().toISOString(),
              },
            });

            console.log(
              `📚 Orphaned ${blogCount} blogs - they remain readable but show no author`
            );

            // Remove the author from local DB (blogs remain due to SetNull)
            await tx.author.delete({
              where: { userId: authorData.userId },
            });

            // Update user status
            await tx.user.update({
              where: { id: authorData.userId },
              data: { isAuthor: false },
            });
          });

          console.log(
            "⚠️ Author suspended - their blogs remain readable as orphaned content"
          );
          await sendAuthorRevokedEmail(authorData.email);

          // Revalidate author-related pages
          revalidateTag("authors");
          revalidateTag("blogs");

          return {
            success: true,
            message: "Author suspended - blogs orphaned but remain readable",
            operation: "AUTHOR_SUSPENDED_BLOGS_ORPHANED",
          };
        } catch (dbError) {
          console.error("Failed to suspend author:", dbError);
          throw new Error("Failed to suspend author");
        }
      } else {
        console.log(
          "ℹ️ Author not approved and not in database - no action needed"
        );
        return {
          success: true,
          message: "Author not approved, no action needed",
          operation: "AUTHOR_PENDING",
        };
      }
    }
  }

  if (!isDocumentStillExistingInSanity) {
    // Document was completely deleted from Sanity (PERMANENT BAN)
    const isAuthorInDb = await prisma.author.findUnique({
      where: { userId: authorData.userId },
    });

    if (isAuthorInDb) {
      try {
        console.log(
          "🗑️ Author permanently deleted from Sanity - orphaning content"
        );

        await prisma.$transaction(async (tx) => {
          // Get count of blogs before orphaning
          const blogCount = await tx.blog.count({
            where: { authorId: authorData.userId },
          });

          // ORPHAN their blogs instead of deleting them
          await tx.blog.updateMany({
            where: { authorId: authorData.userId },
            data: {
              authorId: null,
              sanityUpdatedAt: new Date().toISOString(),
            },
          });

          console.log(
            `📚 Orphaned ${blogCount} blogs due to author deletion - content preserved`
          );

          // Delete the author record (blogs remain due to SetNull)
          await tx.author.delete({
            where: { userId: authorData.userId },
          });

          // Update user status
          await tx.user.update({
            where: { id: authorData.userId },
            data: { isAuthor: false },
          });
        });

        console.log("Author deleted - content preserved as orphaned");
        await sendAuthorRevokedEmail(authorData.email);

        // Revalidate author-related pages
        revalidateTag("authors");
        revalidateTag("blogs");

        return {
          success: true,
          message: "Author deleted - content preserved as orphaned",
          operation: "AUTHOR_DELETED_CONTENT_ORPHANED",
        };
      } catch (dbError) {
        console.error("Failed to delete author:", dbError);
        throw new Error("Failed to delete author from local DB");
      }
    }
  }

  return {
    success: true,
    message: "Author webhook processed with no action needed",
    operation: "AUTHOR_NO_ACTION",
  };
}

// Blog handling logic (unchanged from your original)
async function handleBlogWebhook(blogData: BlogWebHookPayload) {
  console.log(`📝 Processing blog: ${blogData.title} (${blogData._id})`);

  // Query Sanity for current status
  console.log("🔍 Checking blog status in Sanity...");
  const blogWebhookQuery = `*[_type == "blogPost" && _id == $id][0]{
    _id, title, slug, authorDatabaseReferenceId, author->{_id, firstName, lastName, application},
    featuredImage{asset->{_id, url}, alt}, excerpt, content, publishedAt, isApprovedToBePublished,
    readingTime, seo{title, description, ogImage{asset->{_id, url}}}, createdAt, updatedAt
  }`;

  const checkBlogStatus = await sanityFetchWrapper<CheckBlogStatusResponse>(
    blogWebhookQuery,
    { id: blogData._id }
  );

  // Handle blog deletion
  if (!checkBlogStatus) {
    console.log("🗑️ Blog deleted from Sanity, removing from DB...");
    try {
      await prisma.blog.delete({
        where: { sanityId: blogData._id, sanitySlug: blogData.slug.current },
      });
      console.log("✅ Blog removed from database");

      // Revalidate blog-related pages
      revalidateTag("blogs");
      revalidateTag(`blog-${blogData.slug.current}`);

      return {
        success: true,
        message: "Blog deleted and removed from database",
        operation: "BLOG_DELETED",
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          "ℹ️ Blog wasn't in database before walahi, no stress me jhoor"
        );
        return {
          success: true,
          message: "Blog was already deleted",
          operation: "BLOG_ALREADY_DELETED",
        };
      }
      throw new Error("Delete failed");
    }
  }

  // Handle blog approval/unapproval
  const existingBlog = await prisma.blog.findUnique({
    where: {
      sanityId: checkBlogStatus._id,
      sanitySlug: checkBlogStatus.slug.current,
    },
  });

  // Blog is approved - add/update in database
  if (checkBlogStatus.isApprovedToBePublished) {
    if (existingBlog) {
      console.log("🔄 Updating existing approved blog...");
      await prisma.blog.update({
        where: {
          sanityId: checkBlogStatus._id,
          sanitySlug: checkBlogStatus.slug.current,
        },
        data: {
          isPublishedInSanity: true,
          publishedAt: checkBlogStatus.publishedAt,
          sanityUpdatedAt: checkBlogStatus.updatedAt,
        },
      });
      console.log("✅ Blog updated in database");

      // Revalidate blog-related pages
      revalidateTag("blogs");
      revalidateTag(`blog-${checkBlogStatus.slug.current}`);

      return {
        success: true,
        message: "Approved blog updated in database",
        operation: "BLOG_UPDATED",
      };
    } else {
      console.log("➕ Creating new approved blog...");
      await prisma.blog.create({
        data: {
          sanityId: checkBlogStatus._id,
          sanitySlug: checkBlogStatus.slug.current,
          authorId: checkBlogStatus.authorDatabaseReferenceId,
          isPublishedInSanity: true,
          publishedAt: checkBlogStatus.publishedAt,
          sanityUpdatedAt: checkBlogStatus.updatedAt,
        },
      });
      console.log("✅ Blog created in database");

      // Revalidate blog-related pages
      revalidateTag("blogs");
      revalidateTag(`blog-${checkBlogStatus.slug.current}`);

      return {
        success: true,
        message: "Approved blog added to database",
        operation: "BLOG_CREATED",
      };
    }
  }

  // Blog is not approved - remove from database if exists
  if (existingBlog) {
    console.log("🚫 Removing unapproved blog from database...");
    await prisma.blog.delete({
      where: {
        sanityId: checkBlogStatus._id,
        sanitySlug: checkBlogStatus.slug.current,
      },
    });
    console.log("✅ Unapproved blog removed");

    // Revalidate blog-related pages
    revalidateTag("blogs");
    revalidateTag(`blog-${checkBlogStatus.slug.current}`);

    return {
      success: true,
      message: "Unapproved blog removed from database",
      operation: "BLOG_UNAPPROVED_REMOVED",
    };
  } else {
    console.log("ℹ️ Blog not approved and not in database");
    return {
      success: true,
      message: "Blog not approved, no action needed",
      operation: "BLOG_NO_ACTION",
    };
  }
}

export async function POST(request: NextRequest) {
  console.log("🚀 Combined webhook received");

  try {
    // Check signature
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    if (!signature) {
      console.log("❌ No signature found");
      return NextResponse.json(
        { success: false, message: "Missing signature" },
        { status: 400 }
      );
    }

    // Read body
    const body = await readBody(request.body);
    if (!body) {
      console.log("❌ Empty body");
      return NextResponse.json(
        { success: false, message: "Empty body" },
        { status: 400 }
      );
    }

    // Validate signature
    if (!secret) {
      console.log("❌ No webhook secret");
      return NextResponse.json(
        { success: false, message: "Server config error" },
        { status: 500 }
      );
    }

    const isValid = await isValidSignature(body, signature, secret);
    if (!isValid) {
      console.log("❌ Invalid signature");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse payload
    let parsedBody: WebhookPayload;
    try {
      parsedBody = JSON.parse(body);
      console.log(
        `📄 Processing document type: ${parsedBody._type} (${parsedBody._id})`
      );
    } catch (e) {
      console.log("❌ Invalid JSON");
      return NextResponse.json(
        { success: false, message: "Invalid JSON" },
        { status: 400 }
      );
    }

    // Route to appropriate handler based on document type
    let result;

    if (parsedBody._type === "author") {
      result = await handleAuthorWebhook(parsedBody as Author);
    } else if (parsedBody._type === "blogPost") {
      result = await handleBlogWebhook(parsedBody as BlogWebHookPayload);
    } else {
      console.log(`⚠️ Unsupported document type`);
      return NextResponse.json(
        {
          success: true,
          message: `Document type not handled by this webhook`,
          operation: "IGNORED",
        },
        { status: 200 }
      );
    }

    // Return the result from the specific handler
    return NextResponse.json(result, {
      status: result.operation.includes("CREATED") ? 201 : 200,
    });
  } catch (error) {
    console.error("💥 Webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PATCH() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function DELETE() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}


//Todo we go stll come test this thing hard later sha