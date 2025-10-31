import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
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

/**
 * Combined both webhooks into one cos sanity seems to be having fun with me using only one webhook, feels like they spinnig one down
 * in favour of the other
 */

const secret = process.env.SANITY_WEBHOOK_SECRET!;

// ========== INTERFACES ==========
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

// Base webhook payload interface
interface BaseWebhookPayload {
  _type: string;
  _id: string;
}

// Union type for all possible webhook payloads
type CombinedWebhookPayload = Author | BlogWebHookPayload | BaseWebhookPayload;

// ========== REVALIDATION FUNCTIONS ==========
async function revalidateHomepage() {
  revalidateTag("homepage");
  revalidatePath("/");
  return { tags: ["homepage"] };
}

async function revalidateBlogsPage() {
  revalidateTag("blogsPage");
  revalidatePath("/blog");
  return { tags: ["blogsPage"] };
}

async function revalidateAboutPage() {
  revalidateTag("aboutPage");
  revalidatePath("/about");
  return { tags: ["aboutPage"] };
}

async function revalidateContactInfo() {
  revalidateTag("contactInfo");
  revalidatePath("/contact");
  return { tags: ["contactInfo"] };
}

async function revalidateFellowshipEvent() {
  revalidateTag("fellowshipEvent");
  revalidateTag("fellowshipEventMetadata");
  revalidatePath("/events");
  return { tags: ["fellowshipEvent", "fellowshipEventMetadata"] };
}

async function revalidateExecutives() {
  revalidateTag("executives");
  revalidatePath("/executives");
  return { tags: ["executives"] };
}

async function revalidateGallery() {
  revalidateTag("gallery");
  revalidatePath("/gallery");
  return { tags: ["gallery"] };
}

async function revalidateOnlineGiving() {
  revalidateTag("onlineGiving");
  revalidatePath("/giving");
  return { tags: ["onlineGiving"] };
}

async function revalidateSermons() {
  revalidateTag("sermons");
  revalidateTag("sermon");
  revalidateTag("sermonsPageMetadataAndHero");
  revalidatePath("/sermons");
  return { tags: ["sermon"] };
}

async function revalidateLiveStream() {
  revalidateTag("liveStream");
  revalidatePath("/live");
  return { tags: ["liveStream"] };
}

async function revalidateFooter() {
  revalidateTag("footer");
  return { tags: ["footer"] };
}

async function revalidateWhatsappContactWidget() {
  revalidateTag("whatsappContactWidget");
  return { tags: ["whatsappContactWidget"] };
}

// ========== UTILITY FUNCTIONS ==========
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

// ========== DATABASE HANDLERS ==========
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
            const orphanedBlogs = await tx.blog.findMany({
              where: {
                authorId: null,
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
    } else {
      // Author exists in Sanity but is NOT approved (SUSPENDED)
      if (existingAuthorInDb) {
        try {
          await prisma.$transaction(async (tx) => {
            // ORPHAN their blogs (set authorId to null) - blogs remain readable
            await tx.blog.updateMany({
              where: { authorId: authorData.userId },
              data: {
                authorId: null,
                sanityUpdatedAt: new Date().toISOString(),
              },
            });

            // Remove the author from local DB
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

async function handleBlogWebhook(blogData: BlogWebHookPayload) {
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

// ========== REVALIDATION HANDLER ==========
async function handleRevalidationWebhook(docType: string) {
  let revalidationResult;

  switch (docType) {
    case "homepage":
      revalidationResult = await revalidateHomepage();
      break;

    case "aboutpage":
      revalidationResult = await revalidateAboutPage();
      break;

    case "blogsPage":
      revalidationResult = await revalidateBlogsPage();
      break;

    case "contactInfo":
      revalidationResult = await revalidateContactInfo();
      break;

    case "fellowshipEvent":
      revalidationResult = await revalidateFellowshipEvent();
      break;

    case "executives":
      revalidationResult = await revalidateExecutives();
      break;

    case "gallery":
      revalidationResult = await revalidateGallery();
      break;

    case "onlineGiving":
      revalidationResult = await revalidateOnlineGiving();
      break;

    case "sermonsPageMetadataAndHero":
    case "sermon":
      revalidationResult = await revalidateSermons();
      break;

    case "liveStream":
      revalidationResult = await revalidateLiveStream();
      break;

    case "footer":
      revalidationResult = await revalidateFooter();
      break;

    case "whatsappContactWidget":
      revalidationResult = await revalidateWhatsappContactWidget();
      break;

    default:
      return {
        success: true,
        message: `Document type '${docType}' does not require revalidation`,
        operation: "REVALIDATION_NOT_NEEDED",
      };
  }

  return {
    success: true,
    message: `Successfully revalidated for document type: ${docType}`,
    operation: "REVALIDATED",
    revalidated: revalidationResult,
  };
}

// ========== MAIN HANDLER ==========
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
    let parsedBody: CombinedWebhookPayload;
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON" },
        { status: 400 }
      );
    }

    // Ensure we have a document type
    if (!parsedBody._type) {
      return NextResponse.json(
        { success: false, message: "Missing document type" },
        { status: 400 }
      );
    }

    let result;

    // Route based on document type
    switch (parsedBody._type) {
      case "author":
        result = await handleAuthorWebhook(parsedBody as Author);
        break;

      case "blogPost":
        result = await handleBlogWebhook(parsedBody as BlogWebHookPayload);
        break;

      // Handle all other document types for revalidation only
      default:
        result = await handleRevalidationWebhook(parsedBody._type);
        break;
    }

    // Return the result
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

// ========== HTTP METHOD RESTRICTIONS ==========
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
