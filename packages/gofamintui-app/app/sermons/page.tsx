// // app/sermons/page.tsx
// import {
//   sermonsPageQuery,
//   getPaginationParams,
// } from "@/sanity/queries/sermonsPage";
// import { sanityFetchWrapper } from "@/sanity/sanityFetch";
// import SermonsClient from "@/components/sermonsClient";

// interface SermonsPageProps {
//   searchParams: Promise<{
//     search?: string;
//   }>;
// }

// const ITEMS_PER_PAGE = 12;

// export default async function SermonsPage({ searchParams }: SermonsPageProps) {
//   const resolvedSearchParams = await searchParams;
//   const searchQuery = resolvedSearchParams.search || "";

//   try {
//     // Get first batch of sermons
//     const { start, end } = getPaginationParams(1, ITEMS_PER_PAGE);
//     const queryParams = searchQuery
//       ? { search: searchQuery, start, end }
//       : { start, end };

//     const initialSermons = await sanityFetchWrapper<Array<any>>(
//       sermonsPageQuery,
//       queryParams
//     );

//     const validSermons = Array.isArray(initialSermons) ? initialSermons : [];

//     return (
//       <div>
//         <div className="bg-gray-50 py-12">
//           <div className="container mx-auto px-4 text-center">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">Sermons</h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Explore our collection of inspiring sermons and teachings
//             </p>
//           </div>
//         </div>

//         <SermonsClient
//           initialSermons={validSermons}
//           initialSearch={searchQuery}
//         />
//       </div>
//     );
//   } catch (error) {
//     console.error("Error fetching sermons:", error);
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-12 text-center">
//           <h1 className="text-4xl font-bold text-gray-900 mb-8">Sermons</h1>
//           <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">
//               Failed to Load Sermons
//             </h2>
//             <p className="text-gray-600 mb-6">
//               We're having trouble loading the sermons right now. Please try
//               again.
//             </p>
//             <a
//               href="/sermons"
//               className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Try Again
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
// app/sermons/page.tsx
import {
  sermonsPageQuery,
  sermonsSearchQuery,
  getPaginationParams,
} from "@/sanity/queries/sermonsPage";
import { sanityFetchWrapper } from "@/sanity/sanityFetch";
import SermonsClient from "@/components/sermonsClient";
import SermonsPage from "@/components/sermonsClient";

export default function Sermons() {
  return <SermonsPage />;
}
