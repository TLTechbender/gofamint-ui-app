/**
 *
 * I might not be able to explain all the code, I had ideas, I can defend all I implemented but some parts were from ai
 *
 * THE THING IS I got a lot of things to push when we publishig a new article, so I wan like from what we can do in prisma we need to make the process
 * a transaction so that we don't have ghost blog posts so the idea here is simple, make this an atomic transcation, if anything fails all fail
 *
 *
 *
 *
 * idea: I need all the slugs to be unique cos that's what I would use to fetch the articles, so I need to generate a unique slug was checking for uniqueness with api calls before
 * but imagine hainv a while loop and looping api calls that would get expensive real fast, so I whipped up a small way of ensuring uniqeness, can't say but at least we should avaoid collison of slugs to a very large extent
 *
 * fino allo fine
 *
 *
 * I swear to God, I saw my content exactly as is in sanity studio, I fess cry for like 2 mins, say chai that boy wey dey find document.querySelector don go far!!!
 */

export const uploadImageToSanity = async (file: File): Promise<any> => {
  try {
    const imageAsset = await sanityClient.assets.upload("image", file, {
      filename: file.name,
    });
    return imageAsset;
  } catch (error) {
    console.error("Error uploading image to Sanity:", error);
    throw error;
  }
};

// Helper function to delete uploaded assets (for rollback)
const deleteAssetFromSanity = async (assetId: string): Promise<void> => {
  try {
    await sanityClient.delete(assetId);
    console.log(`Rolled back asset: ${assetId}`);
  } catch (error) {
    console.error(`Failed to rollback asset ${assetId}:`, error);
    // Don't throw here as we're already in an error state
  }
};

// Generate guaranteed unique slug
const generateUniqueSlug = (title: string, authorUsername: string): string => {
  // Get current date in YYYY-MM-DD format
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // 2025-08-22

  // Add time component for extra uniqueness (HHMM format)
  const timeStr = now.toTimeString().slice(0, 5).replace(":", ""); // 1430 for 14:30

  // Clean the title for URL safety
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .slice(0, 50); // Limit length

  // Clean authorUsername
  const cleanUsername = authorUsername
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20); // Limit length

  // Generate random suffix for extra collision prevention
  const randomSuffix = Math.random().toString(36).substring(2, 6); // 4 char random

  // Combine: title-username-date-time-random
  return `${cleanTitle}-${cleanUsername}-${dateStr}-${timeStr}-${randomSuffix}`;
};

// Atomic transaction function for processing all images
export const processArticleImagesTransaction = async (
  articleData: any,
  authorUsername: string,
  authorSanityReferenceId: string,
  authorDatabaseReferenceId: string
) => {
  const uploadedAssets: string[] = []; // Track all uploaded asset IDs for rollback

  try {
    // Step 1: Process content images
    const processedContent = [];

    for (const block of articleData.content) {
      if (
        block._type === "image" &&
        block.src &&
        block.src.startsWith("data:")
      ) {
        // Convert base64 to blob/file
        const response = await fetch(block.src);
        const blob = await response.blob();

        // Create a file object
        const file = new File([blob], block.alt || "image.jpg", {
          type: blob.type || "image/jpeg",
        });

        // Upload to Sanity
        const imageAsset = await uploadImageToSanity(file);
        uploadedAssets.push(imageAsset._id); // Track for potential rollback

        // Replace with Sanity reference
        processedContent.push({
          ...block,
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
          alt: block.alt,
          // Remove the base64 src
          src: undefined,
        });
      } else {
        processedContent.push(block);
      }
    }

    // Step 2: Process poster/featured image
    let processedPosterImage = null;
    if (
      articleData.posterImage &&
      articleData.posterImage.src &&
      articleData.posterImage.src.startsWith("data:")
    ) {
      // Convert base64 to blob/file
      const response = await fetch(articleData.posterImage.src);
      const blob = await response.blob();

      // Create a file object
      const file = new File(
        [blob],
        articleData.posterImage.alt || "poster.jpg",
        {
          type: blob.type || "image/jpeg",
        }
      );

      // Upload to Sanity
      const imageAsset = await uploadImageToSanity(file);
      uploadedAssets.push(imageAsset._id); // Track for potential rollback

      // Return Sanity image structure
      processedPosterImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
        alt: articleData.posterImage.alt,
      };
    } else if (articleData.posterImage) {
      // If poster image exists but doesn't need processing
      processedPosterImage = articleData.posterImage;
    }

    // Step 3: Generate guaranteed unique slug (NO API CALL NEEDED!)
    const uniqueSlug = generateUniqueSlug(articleData.title, authorUsername);

    // Step 4: Populate SEO data from article data
    const seoData = {
      title: articleData.title,
      description:
        articleData.excerpt ||
        "Read this amazing article on GSF UI – Gofamint Students' Fellowship, University of Ibadan",
      ogImage: processedPosterImage, // Use the poster/featured image as OG image
    };

    // Step 5: Create the final article data
    const processedArticleData = {
      ...articleData,
      content: processedContent,
      posterImage: processedPosterImage,
      slug: {
        _type: "slug" as const,
        current: uniqueSlug,
      },
      seo: seoData, // Populate SEO from article data
    };

    const rawData = {
      _type: "blogPost" as const,
      title: processedArticleData.title,
      slug: processedArticleData.slug,
      author: {
        _type: "reference",
        _ref: authorSanityReferenceId,
      },
      authorDatabaseReferenceId: authorDatabaseReferenceId,
      isApprovedToBePublished: false,
      excerpt: processedArticleData.excerpt,
      featuredImage: processedPosterImage,
      content: processedContent,
      publishedAt: processedArticleData.publishedAt || new Date().toISOString(),
      readingTime: processedArticleData.readingTime,
      seo: seoData, // Use populated SEO data
      createdAt: processedArticleData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // This is the final step - if this fails, we rollback everything
    const response = await sanityCreateWrapper(rawData);

    // If we reach here, everything succeeded
    console.log(
      `Transaction completed successfully. Uploaded ${uploadedAssets.length} assets.`
    );
    console.log(`Generated unique slug: ${uniqueSlug}`);
    return response;
  } catch (error) {
    // ROLLBACK: If anything fails, delete all uploaded assets
    console.error("Transaction failed, rolling back uploaded assets:", error);

    if (uploadedAssets.length > 0) {
      console.log(`Rolling back ${uploadedAssets.length} uploaded assets...`);

      // Delete all uploaded assets in parallel
      const rollbackPromises = uploadedAssets.map((assetId) =>
        deleteAssetFromSanity(assetId)
      );

      await Promise.allSettled(rollbackPromises);
      console.log("Rollback completed");
    }

    // Re-throw the original error
    throw new Error(
      `Article creation failed: ${(error instanceof Error && error.message) || error}`
    );
  }
};

import { sanityClient } from "@/sanity/sanityClient";
import { sanityCreateWrapper } from "@/sanity/sanityCRUDHandlers";
import { PortableTextBlock } from "@portabletext/editor";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface Article {
  _id?: string;
  title: string;
  slug?: {
    _type: "slug";
    current: string;
  };

  excerpt: string;
  posterImage?: {
    src: string;
    alt?: string;
  };
  content: PortableTextBlock[];
  publishedAt?: string;

  readingTime?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt?: string;
}

interface SubmitArticleParams {
  articleData: Article;
  authorUsername: string;
  authorSanityReferenceId: string;
  authorDatabaseReferenceId: string;
}

export default function useSubmitNewArticle() {
  console.log(process.env.NEXT_PUBLIC_SANITY_TOKEN, "NEXT_SANITY_TOKEN");
  const submitNewArticleMutation = useMutation({
    mutationKey: ["submitNewArticle"],
    mutationFn: async ({
      articleData,
      authorUsername,
      authorSanityReferenceId,
      authorDatabaseReferenceId,
    }: SubmitArticleParams) => {
      // Use the atomic transaction function with unique slug generation
      return await processArticleImagesTransaction(
        articleData,
        authorUsername,
        authorSanityReferenceId,
        authorDatabaseReferenceId
      );
    },
    onSuccess: (data) => {
      console.log("Article submitted successfully with all images:", data);
      toast.success("Article submitted successfully!");
      //Create the db reference to the article like that
      console.log("data from the article submission");

      {
        /**
        What I am about to do here

        update: ist's not smart to do it here, a webhook should handle that
        */
      }

      // await prisma.blog.create({
      //   data: {
      //     sanityId: blogData.sanityId, // From Sanity's _id
      //     sanitySlug: blogData.sanitySlug, // From Sanity's slug
      //     authorId: blogData.authorId, // Your local author ID
      //     isPublishedInSanity: blogData.isPublishedInSanity || false,
      //     publishedAt: blogData.publishedAt || null,
      //     sanityUpdatedAt: blogData.sanityUpdatedAt || new Date(),
      //   },
      //   include: {
      //     author: {
      //       include: {
      //         user: true, // Include user details if needed
      //       },
      //     },
      //   },
      // });

      //todo: come write am
    },
    onError: (error) => {
      console.error(
        "Article submission failed (all images rolled back):",
        error
      );
      toast.error(`Article submission failed, hold on and try again later:=`);
    },
  });

  return {
    submitArticle: submitNewArticleMutation.mutate,

    isSubmitting: submitNewArticleMutation.isPending,
    error: submitNewArticleMutation.error,
    isSuccess: submitNewArticleMutation.isSuccess,
    data: submitNewArticleMutation.data,
  };
}
