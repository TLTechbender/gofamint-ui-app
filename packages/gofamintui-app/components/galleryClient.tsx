
// "use client";
// import "../styles/gallery.css";
// import "react-image-gallery/styles/css/image-gallery.css"; // Add this import

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Image from "next/image";
// import Masonry from "react-masonry-css";

// import ImageGallery from "react-image-gallery";

// import { useRouter } from "next/navigation";
// import { useSearchParams } from "next/navigation";
// import { urlFor } from "@/sanity/sanityClient";
// import useInfiniteGallery from "@/hooks/useGalleryPage";
// import { buildGalleryImagesBySlugQuery } from "@/sanity/queries/galleryPage";
// import { SanityImage } from "@/sanity/interfaces/sanityImage";
// import InfiniteScrollContainer from "./infiniteScrollContainer";

// const breakpointColumns = {
//   default: 4,
//   1100: 3,
//   700: 2,
//   500: 1,
// };

// const GalleryClient = ({ slug }: { slug: string }) => {
//   const [showGallery, setShowGallery] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   console.log(slug);

//   const { data, hasNextPage, isError, isLoading, fetchNextPage } =
//     useInfiniteGallery({ slug });
//   console.log("Data:", data);

//   // Extract all images from the data structure you provided
//   const allPictures = useMemo(() => {
//     if (!data?.pages) return [];

//     return data.pages.flatMap((page: any) => {
//       const events = page.galleryResponse || page || [];

//       // Ensure events is an array
//       const eventsArray = Array.isArray(events) ? events : [events];

//       // Extract images from each event's images array
//       return eventsArray.flatMap((event: any) => {
//         if (!event || typeof event !== "object") return [];
//         return event.images || [];
//       });
//     });
//   }, [data?.pages]);

//   console.log("All Pictures:", allPictures);

//   // Make handleDownload available globally for the gallery descriptions
//   useEffect(() => {
//     (window as any).handleDownloadFromGallery = handleDownload;
//     return () => {
//       delete (window as any).handleDownloadFromGallery;
//     };
//   }, []);

//   const handleImageClick = (index: number) => {
//     setCurrentIndex(index);
//     setShowGallery(true);
//   };

//   const handleDownload = async (imageUrl: string, filename: string) => {
//     try {
//       const response = await fetch(imageUrl);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//     }
//   };

//   // Handle gallery navigation and auto-load more images
//   const handleGallerySlide = async (index: number) => {
//     setCurrentIndex(index);

//     // Check if we're near the end and need to load more
//     const isNearEnd = index >= allPictures.length - 3; // Load when 3 images from the end

//     if (isNearEnd && hasNextPage && !isLoadingMore) {
//       setIsLoadingMore(true);
//       try {
//         await fetchNextPage();
//       } catch (error) {
//         console.error("Failed to fetch next page:", error);
//       } finally {
//         setIsLoadingMore(false);
//       }
//     }
//   };

//   // Transform images for react-image-gallery
//   const galleryImages = useMemo(() => {
//     const images = allPictures
//       .map((img: any, index: number) => {
//         console.log("Image item structure:", img);

//         // Based on your JSON structure, the image asset is at img.image.asset
//         const imageAsset = img.image?.asset;

//         if (!imageAsset) {
//           console.error("No valid image asset found:", img);
//           return null;
//         }

//         return {
//           original: urlFor(imageAsset)
//             .width(1200)
//             .height(1200)
//             .fit("max")
//             .auto("format")
//             .url(),
//           thumbnail: urlFor(imageAsset)
//             .width(400)
//             .height(600)
//             .fit("crop")
//             .auto("format")
//             .url(),
//           description: `
//           <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
//             <span>${img.alt || img.caption || `Photo ${index + 1}`}</span>
//             <button 
//               onclick="handleDownloadFromGallery('${urlFor(imageAsset).width(1200).height(1200).fit("max").auto("format").url()}', '${img.alt || img.caption || `photo-${index + 1}`}.jpg')"
//               style="
//                 background: #007bff; 
//                 color: white; 
//                 border: none; 
//                 padding: 8px 16px; 
//                 border-radius: 4px; 
//                 cursor: pointer;
//                 font-size: 14px;
//               "
//             >
//               Download
//             </button>
//           </div>
//         `,
//         };
//       })
//       .filter(Boolean);

//     // Add loading placeholder if we're loading more images
//     if (isLoadingMore && hasNextPage) {
//       images.push({
//         original:
//           "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+",
//         thumbnail:
//           "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+",
//         description:
//           '<div style="text-align: center; padding: 10px;">Loading more images...</div>',
//       });
//     }

//     return images;
//   }, [allPictures, isLoadingMore, hasNextPage]);

//   return (
//     <div>
//       <div>
//         <InfiniteScrollContainer
//           onBottomReached={() => {
//             if (hasNextPage) {
//               return fetchNextPage();
//             }
//             return;
//           }}
//         >
//           <Masonry
//             breakpointCols={breakpointColumns}
//             className="masonry-grid"
//             columnClassName="masonry-column"
//           >
//             {allPictures
//               .map((picture, index) => {
//                 console.log("Picture item:", picture);

//                 // Access the image asset from your JSON structure
//                 const imageAsset = picture.image?.asset;

//                 if (!imageAsset) {
//                   console.error(
//                     "No valid image asset found for picture:",
//                     picture
//                   );
//                   return null;
//                 }

//                 return (
//                   <div
//                     key={`${imageAsset._id}-${index}`} // Use the asset ID as key
//                     className="masonry-item"
//                     onClick={() => handleImageClick(index)}
//                     style={{ position: "relative" }}
//                     onMouseEnter={(e) => {
//                       const btn = e.currentTarget.querySelector(
//                         ".download-btn"
//                       ) as HTMLElement;
//                       if (btn) btn.style.opacity = "1";
//                     }}
//                     onMouseLeave={(e) => {
//                       const btn = e.currentTarget.querySelector(
//                         ".download-btn"
//                       ) as HTMLElement;
//                       if (btn) btn.style.opacity = "0";
//                     }}
//                   >
//                     <Image
//                       src={urlFor(imageAsset).width(400).auto("format").url()}
//                       alt={
//                         picture.alt || picture.caption || `Photo ${index + 1}`
//                       }
//                       width={400}
//                       height={600}
//                       className="masonry-image"
//                       placeholder="blur"
//                       blurDataURL={
//                         imageAsset.metadata?.lqip ||
//                         urlFor(imageAsset).width(20).height(20).blur(50).url()
//                       }
//                     />
//                     <button
//                       className="download-btn"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDownload(
//                           urlFor(imageAsset)
//                             .width(1200)
//                             .height(1200)
//                             .fit("max")
//                             .auto("format")
//                             .url(),
//                           `${picture.alt || picture.caption || `photo-${index + 1}`}.jpg`
//                         );
//                       }}
//                       style={{
//                         position: "absolute",
//                         top: "10px",
//                         right: "10px",
//                         background: "rgba(0, 0, 0, 0.7)",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "4px",
//                         padding: "8px 12px",
//                         cursor: "pointer",
//                         fontSize: "12px",
//                         opacity: "0",
//                         transition: "opacity 0.3s ease",
//                       }}
//                     >
//                       ⬇️
//                     </button>
//                   </div>
//                 );
//               })
//               .filter(Boolean)}
//           </Masonry>
//         </InfiniteScrollContainer>

//         {showGallery && (
//           <div className="gallery-overlay">
//             <ImageGallery
//               items={galleryImages}
//               startIndex={currentIndex}
//               onSlide={handleGallerySlide} // Use the enhanced slide handler
//               showThumbnails={true}
//               showFullscreenButton={true}
//               showPlayButton={false}
//               onScreenChange={() => setShowGallery(false)}
//               additionalClass="custom-gallery"
//             />
//             <button
//               className="gallery-close-btn"
//               onClick={() => setShowGallery(false)}
//               aria-label="Close gallery"
//             >
//               ×
//             </button>
//             {isLoadingMore && (
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "20px",
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   background: "rgba(0, 0, 0, 0.8)",
//                   color: "white",
//                   padding: "8px 16px",
//                   borderRadius: "4px",
//                   fontSize: "14px",
//                   zIndex: 9999,
//                 }}
//               >
//                 Loading more images...
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GalleryClient;