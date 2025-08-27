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
import { revalidatePath, revalidateTag } from "next/cache";

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
  const isDocumentStillExistingInSanity = await sanityFetchWrapper<Author>(
    authorQuery,
    { userId: authorData.userId }
  );

  if (isDocumentStillExistingInSanity) {
    // Check if author exists in local DB
    const existingAuthorInDb = await prisma.author.findUnique({
      where: { userId: authorData.userId },
    });

    if (isDocumentStillExistingInSanity.application.isApproved) {
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
            }

            const updatedUser = await tx.user.update({
              where: { id: isDocumentStillExistingInSanity.userId },
              data: { isAuthor: true },
            });

            return { newAuthor, updatedUser };
          });

          if (result) {
            await sendAuthorApprovedEmail(
              isDocumentStillExistingInSanity.email,
              isDocumentStillExistingInSanity.firstName
            );

            // Revalidate author-related pages
            revalidateTag("author");
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
        return {
          success: true,
          message: "Author already approved and in database",
          operation: "AUTHOR_ALREADY_APPROVED",
        };
      }

      //todo: implement for blogs  revalidatePath(`/${issueNumber}`);
    } else {
      // Author exists in Sanity but is NOT approved (SUSPENDED)

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

          await sendAuthorRevokedEmail(authorData.email);

          // Revalidate author-related pages
          revalidateTag("authors");
          revalidateTag("blog");
          revalidateTag("blogPost");

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

        await sendAuthorRevokedEmail(authorData.email);

        // Revalidate author-related pages
        revalidateTag("author");
        revalidateTag("blog");
        revalidateTag("blogPost");

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
  // Query Sanity for current status
  //Keeping the query here cos it wasn't worth making this another files
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
    try {
      await prisma.blog.delete({
        where: { sanityId: blogData._id, sanitySlug: blogData.slug.current },
      });

      // Revalidate blog-related pages
      revalidateTag("blogPost");
      revalidateTag(`blog/${blogData.slug.current}`);
      revalidatePath(`/blog`);
      revalidatePath(`blog/${blogData.slug.current}`);

      return {
        success: true,
        message: "Blog deleted and removed from database",
        operation: "BLOG_DELETED",
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: true,
          message: "Blog was already deleted",
          operation: "BLOG_ALREADY_DELETED",
        };
      }
      throw new Error("Delete failed");
    }
  }

  const existingBlog = await prisma.blog.findUnique({
    where: {
      sanityId: checkBlogStatus._id,
      sanitySlug: checkBlogStatus.slug.current,
    },
  });

  if (checkBlogStatus.isApprovedToBePublished) {
    if (existingBlog) {
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

      // Revalidate blog-related pages
      revalidateTag("blogs");
      revalidatePath(`/blog`);
      revalidateTag(`blog-${checkBlogStatus.slug.current}`);
      revalidatePath(`/blog/${blogData.slug.current}`);

      return {
        success: true,
        message: "Approved blog updated in database",
        operation: "BLOG_UPDATED",
      };
    } else {
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

      // Revalidate blog-related pages
      revalidateTag("blogs");
      revalidateTag(`blog-${checkBlogStatus.slug.current}`);
      revalidatePath(`/blog`);
      revalidatePath(`/blog/${blogData.slug.current}`);

      return {
        success: true,
        message: "Approved blog added to database",
        operation: "BLOG_CREATED",
      };
    }
  }

  // Blog is not approved - remove from database if exists
  if (existingBlog) {
    await prisma.blog.delete({
      where: {
        sanityId: checkBlogStatus._id,
        sanitySlug: checkBlogStatus.slug.current,
      },
    });

    // Revalidate blog-related pages
    revalidateTag("blogs");
    revalidateTag(`blog-${checkBlogStatus.slug.current}`);
    revalidatePath(`/blog/${blogData.slug.current}`);

    return {
      success: true,
      message: "Unapproved blog removed from database",
      operation: "BLOG_UNAPPROVED_REMOVED",
    };
  } else {
    return {
      success: true,
      message: "Blog not approved, no action needed",
      operation: "BLOG_NO_ACTION",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check signature
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing signature" },
        { status: 400 }
      );
    }

    // Read body
    const body = await readBody(request.body);
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Empty body" },
        { status: 400 }
      );
    }

    // Validate signature
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Server config error" },
        { status: 500 }
      );
    }

    const isValid = await isValidSignature(body, signature, secret);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse payload
    let parsedBody: WebhookPayload;
    try {
      parsedBody = JSON.parse(body);
     
    } catch (e) {
    
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

