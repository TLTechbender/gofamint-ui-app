import { sanityClient } from "@/sanity/sanityClient";
import {
  sanityPatchWrapper,
  sanityFetchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import type { PortableTextBlock } from "@portabletext/editor";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Upload image function for this hook
const uploadImageToSanity = async (file: File): Promise<any> => {
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

interface UpdateArticleParams {
  articleId: string;
  articleData: Article;
  authorSanityReferenceId: string;
  authorDatabaseReferenceId: string;
}

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
    asset?: {
      _type: "reference";
      _ref: string;
    };
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

// Helper function to recursively extract asset references from content
const extractAssetRefsFromContent = (content: any[]): string[] => {
  const assets: string[] = [];

  const traverse = (obj: any) => {
    if (obj && typeof obj === "object") {
      // Check if this is an image block with asset reference
      if (obj._type === "image" && obj.asset?._ref) {
        assets.push(obj.asset._ref);
      }

      // Recursively traverse all properties
      Object.values(obj).forEach((value) => {
        if (Array.isArray(value)) {
          value.forEach(traverse);
        } else if (value && typeof value === "object") {
          traverse(value);
        }
      });
    }
  };

  content.forEach(traverse);
  return assets;
};

// Get existing assets from an article for cleanup tracking - FIXED VERSION
const getExistingArticleAssets = async (
  articleId: string
): Promise<string[]> => {
  try {
    // Fetch the complete document to properly extract assets
    const query = `*[_type == "blogPost" && _id == $articleId][0]{
      content,
      featuredImage
    }`;

    const result = await sanityFetchWrapper(query, { articleId });

    if (!result) {
      return [];
    }

    const assets: string[] = [];

    // Extract assets from content using recursive traversal
    if (result.content && Array.isArray(result.content)) {
      const contentAssets = extractAssetRefsFromContent(result.content);
      assets.push(...contentAssets);
    }

    // Extract featured image asset
    if (result.featuredImage?.asset?._ref) {
      assets.push(result.featuredImage.asset._ref);
    }

    return [...new Set(assets)]; // Remove duplicates
  } catch (error) {
    return [];
  }
};

// Helper function to delete uploaded assets (reuse from create hook)
const deleteAssetFromSanity = async (assetId: string): Promise<void> => {
  try {
    await sanityClient.delete(assetId);
  } catch (error) {
    // Don't throw here as we're already in an error state
  }
};

// Find assets that are no longer being used (for cleanup)
const findUnusedAssets = (
  existingAssets: string[],
  newAssets: string[]
): string[] => {
  const unused = existingAssets.filter(
    (assetId) => !newAssets.includes(assetId)
  );

  return unused;
};

// Fixed atomic transaction function for updating existing articles
const updateArticleImagesTransaction = async (
  articleId: string,
  articleData: any,
  authorSanityReferenceId: string,
  authorDatabaseReferenceId: string
) => {
  const newlyUploadedAssets: string[] = []; // Track new uploads for rollback
  let existingAssetsBeforeUpdate: string[] = [];

  try {
    // Step 1: Fetch the COMPLETE current document first
    const currentDocument = await sanityFetchWrapper(
      `*[_type == "blogPost" && _id == $articleId][0]`,
      { articleId }
    );

    if (!currentDocument) {
      throw new Error(`Article with ID ${articleId} not found`);
    }

    // Step 2: Get existing assets for cleanup tracking
    existingAssetsBeforeUpdate = await getExistingArticleAssets(articleId);

    // Step 3: Process content images
    const processedContent = [];
    const assetsAfterProcessing: string[] = [];

    for (const block of articleData.content) {
      if (
        block._type === "image" &&
        block.src &&
        block.src.startsWith("data:")
      ) {
        // NEW IMAGE: Convert base64 to blob and upload

        const response = await fetch(block.src);
        const blob = await response.blob();
        const file = new File([blob], block.alt || "image.jpg", {
          type: blob.type || "image/jpeg",
        });

        const imageAsset = await uploadImageToSanity(file);
        newlyUploadedAssets.push(imageAsset._id);
        assetsAfterProcessing.push(imageAsset._id);

        processedContent.push({
          ...block,
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
          alt: block.alt,
          src: undefined, // Remove base64 data
        });
      } else if (block._type === "image" && block.asset?._ref) {
        // EXISTING IMAGE: Keep the reference as-is

        assetsAfterProcessing.push(block.asset._ref);
        processedContent.push({
          ...block,
          src: undefined, // Clean up any src field
        });
      } else {
        // NON-IMAGE BLOCK: Keep as-is
        processedContent.push(block);
      }
    }

    // Step 4: Process poster/featured image
    let processedPosterImage = null;
    if (articleData.posterImage?.src?.startsWith("data:")) {
      // NEW poster image from base64

      const response = await fetch(articleData.posterImage.src);
      const blob = await response.blob();
      const file = new File(
        [blob],
        articleData.posterImage.alt || "poster.jpg",
        { type: blob.type || "image/jpeg" }
      );

      const imageAsset = await uploadImageToSanity(file);
      newlyUploadedAssets.push(imageAsset._id);
      assetsAfterProcessing.push(imageAsset._id);

      processedPosterImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
        alt: articleData.posterImage.alt,
      };
    } else if (articleData.posterImage?.asset?._ref) {
      // EXISTING poster image

      assetsAfterProcessing.push(articleData.posterImage.asset._ref);
      processedPosterImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: articleData.posterImage.asset._ref,
        },
        alt: articleData.posterImage.alt,
      };
    } else if (articleData.posterImage && !articleData.posterImage.src) {
      // OTHER poster image format (already processed)
      processedPosterImage = articleData.posterImage;
      if (articleData.posterImage.asset?._ref) {
        assetsAfterProcessing.push(articleData.posterImage.asset._ref);
      }
    } else {
      // NO poster image provided, preserve existing one
      processedPosterImage = currentDocument.featuredImage;
      if (currentDocument.featuredImage?.asset?._ref) {
        assetsAfterProcessing.push(currentDocument.featuredImage.asset._ref);
      }
    }

    // Step 5: Update SEO data
    const seoData = {
      title: articleData.title,
      description:
        articleData.excerpt ||
        "Read this amazing article on GSF UI – Gofamint Students' Fellowship, University of Ibadan",
      ogImage: processedPosterImage,
    };

    // Step 6: Prepare COMPLETE update data (preserving all existing fields)
    const updateData = {
      // Preserve system fields
      _type: currentDocument._type || "blogPost",

      // Update with new data
      title: articleData.title,

      // CRITICAL: Always preserve existing slug unless explicitly updating it
      slug:
        articleData.slug?.current && articleData.slug.current.trim() !== ""
          ? articleData.slug
          : currentDocument.slug, // Use existing slug

      author: {
        _type: "reference",
        _ref: authorSanityReferenceId,
      },
      authorDatabaseReferenceId: authorDatabaseReferenceId,
      excerpt: articleData.excerpt,
      featuredImage: processedPosterImage,
      content: processedContent,

      // Handle optional fields - preserve existing if not provided
      publishedAt: articleData.publishedAt || currentDocument.publishedAt,
      readingTime: articleData.readingTime || currentDocument.readingTime,

      seo: seoData,
      updatedAt: new Date().toISOString(),

      // Preserve timestamps
      _createdAt: currentDocument._createdAt,

      // Preserve any other fields that might exist
      ...Object.keys(currentDocument).reduce((acc, key) => {
        // Skip fields we're explicitly handling
        const handledFields = [
          "_type",
          "_id",
          "_rev",
          "_createdAt",
          "_updatedAt",
          "title",
          "slug",
          "author",
          "authorDatabaseReferenceId",
          "excerpt",
          "featuredImage",
          "content",
          "publishedAt",
          "readingTime",
          "seo",
          "updatedAt",
        ];

        if (!handledFields.includes(key) && key !== "_id" && key !== "_rev") {
          acc[key] = currentDocument[key];
        }
        return acc;
      }, {} as any),
    };

    // Step 7: Update the article using set operation (full replacement)
    const response = await sanityPatchWrapper(articleId, {
      set: updateData,
    });

    // Step 8: Clean up unused assets (after successful update)
    const unusedAssets = findUnusedAssets(
      existingAssetsBeforeUpdate,
      assetsAfterProcessing
    );

    if (unusedAssets.length > 0) {
    
      const cleanupPromises = unusedAssets.map((assetId) =>
        deleteAssetFromSanity(assetId)
      );
      await Promise.allSettled(cleanupPromises);
    
    } 

   
    return response;
  } catch (error) {
    // ROLLBACK: Delete only the newly uploaded assets
  

    if (newlyUploadedAssets.length > 0) {
     
      const rollbackPromises = newlyUploadedAssets.map((assetId) =>
        deleteAssetFromSanity(assetId)
      );
      await Promise.allSettled(rollbackPromises);
    
    }

    throw new Error(
      `Article update failed: ${(error instanceof Error && error.message) || error}`
    );
  }
};

export default function useUpdateArticle() {
  const updateArticleMutation = useMutation({
    mutationKey: ["updateArticle"],
    mutationFn: async ({
      articleId,
      articleData,
      authorSanityReferenceId,
      authorDatabaseReferenceId,
    }: UpdateArticleParams) => {
      return await updateArticleImagesTransaction(
        articleId,
        articleData,
        authorSanityReferenceId,
        authorDatabaseReferenceId
      );
    },
    onSuccess: (data) => {
     
      toast.success("Article updated successfully!");
    },
    onError: (error) => {
   
      toast.error("Article update failed, please try again later");
    },
  });

  return {
    updateArticle: updateArticleMutation.mutate,
    isUpdating: updateArticleMutation.isPending,
    error: updateArticleMutation.error,
    isSuccess: updateArticleMutation.isSuccess,
    data: updateArticleMutation.data,
  };
}
