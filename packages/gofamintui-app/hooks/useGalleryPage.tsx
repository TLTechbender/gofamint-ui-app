// "use client";
// import { GalleryBySlug } from "@/sanity/interfaces/galleryPage";
// import {
//   buildGalleryImagesBySlugQuery,
//   buildGalleryImagesCountBySlugQuery,
// } from "@/sanity/queries/galleryPage";
// import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useMemo, useCallback } from "react";

// const ITEMS_PER_PAGE = 2;

// // Memoize the query function to prevent recreation on every render
// const createGalleryImagesQueryFunction =
//   () =>
//   async ({
//     start,
//     end,
//     slug,
//   }: {
//     start: number;
//     end: number;
//     slug: string;
//   }) => {
//     const params = {
//       start,
//       end,
//       slug,
//     };

//     const [galleryResponse, totalCount] = await Promise.all([
//       sanityFetchWrapper<GalleryBySlug>(buildGalleryImagesBySlugQuery, params),
//       sanityFetchWrapper<number>(buildGalleryImagesCountBySlugQuery, {
//         slug,
//       }),
//     ]);

//     const hasMore = end < totalCount;

//     return {
//       galleryResponse,
//       hasMore,
//       totalCount,
//       totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
//     };
//   };

// // Create the query function once
// const infiniteGalleryImagesQueryFunction = createGalleryImagesQueryFunction();

// export default function useInfiniteGallery({ slug }: { slug: string }) {
//   // Memoize the query function to prevent unnecessary re-creations
//   const queryFn = useCallback(
//     ({ pageParam = 1 }) => {
//       const start = (pageParam - 1) * ITEMS_PER_PAGE;
//       const end = start + ITEMS_PER_PAGE;
//       return infiniteGalleryImagesQueryFunction({ slug, start, end });
//     },
//     [slug] // Only recreate when slug changes
//   );

//   // Memoize getNextPageParam to prevent unnecessary re-creations
//   const getNextPageParam = useCallback((lastPage: any, allPages: any[]) => {
//     return lastPage.hasMore ? allPages.length + 1 : undefined;
//   }, []);

//   const {
//     data,
//     isLoading,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteQuery({
//     queryKey: ["infinite", "gallery-images", slug],
//     queryFn,
//     getNextPageParam,
//     initialPageParam: 1,
//     staleTime: 5 * 60 * 1000, // 5 minutes - prevents unnecessary refetches
//     gcTime: 10 * 60 * 1000, // 10 minutes - keeps data in cache longer
//     refetchOnWindowFocus: false, // Prevent refetch on window focus
//     refetchOnMount: false, // Prevent refetch on component mount if data exists
//   });

//   // Get gallery info from first page (this remains constant across pages)
//   const galleryInfo = useMemo(() => {
//     if (!data?.pages?.[0]?.galleryResponse) return null;

//     const firstGallery = data.pages[0].galleryResponse;
//     return {
//       _id: firstGallery._id,
//       title: firstGallery.title,
//       slug: firstGallery.slug,
//       description: firstGallery.description,
//       featuredImage: firstGallery.featuredImage,
//       category: firstGallery.category,
//       eventDate: firstGallery.eventDate,
//       location: firstGallery.location,
//       tags: firstGallery.tags,
//       _createdAt: firstGallery._createdAt,
//     };
//   }, [data?.pages]);

//   // Memoize flattened gallery images to prevent unnecessary recalculations
//   const allImages = useMemo(() => {
//     if (!data?.pages) return [];
//     return data.pages.flatMap((page) => page.galleryResponse?.media || []);
//   }, [data?.pages]);

//   // Memoize metadata to prevent unnecessary recalculations
//   const metadata = useMemo(() => {
//     if (!data?.pages?.[0]) return null;

//     const firstPage = data.pages[0];
//     return {
//       totalCount: firstPage.totalCount,
//       totalPages: firstPage.totalPages,
//     };
//   }, [data?.pages]);

//   // Memoize the fetchNextPage function to prevent unnecessary recreations
//   const memoizedFetchNextPage = useCallback(() => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

//   return {
//     // Raw data (if needed for debugging)
//     data,
//     // Processed data
//     galleryInfo,
//     images: allImages,
//     metadata,
//     // Loading states
//     isLoading,
//     isError,
//     isFetchingNextPage,
//     // Actions
//     fetchNextPage: memoizedFetchNextPage,
//     hasNextPage,
//     // Utility
//     isEmpty: allImages.length === 0 && !isLoading,
//     totalImages: allImages.length,
//   };
// }
