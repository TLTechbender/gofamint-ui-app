
// "use client";
// import React, { use, useEffect, useState } from "react";
// import Image from "next/image";
// import {
//   Heart,
//   MessageCircle,
//   ChevronDown,
//   ChevronUp,
//   Reply,
//   Eye,
//   Trash2,
// } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   useBlogStats,
//   useBlogComments,
//   useBlogLike,
//   useCommentLike,
//   useAddComment,
//   useAddReply,
//   type Comment,
//   type CommentReply,
//   type BlogStats as BlogStatsType,
// } from "../../../hooks/useBlogPage";

// interface User {
//   name: string;
//   email: string;
//   id: string;
//   userName: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   bio: string;
//   isAuthor: boolean;
//   isVerified: boolean;
// }

// interface Session {
//   user: User;
//   expires: string; // ISO date string
// }

// interface BlogAuthorInfo {
//   userId: string;
//   profilePictureUrl: string;
//   firstName: string;
//   lastName: string;
// }

// // User Avatar Component - Now much simpler
// const UserAvatar = ({
//   user,
//   size = 40,
//   blogAuthorInfo,
//   onClick,
// }: {
//   user: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };
//   size?: number;
//   blogAuthorInfo: BlogAuthorInfo;
//   onClick?: () => void;
// }) => {
//   const [imageError, setImageError] = useState(false);

//   const initials =
//     (user?.firstName?.charAt(0) || "") + (user?.lastName?.charAt(0) || "");

//   // Check if this user is the blog post author
//   const isBlogPostAuthor = user.id === blogAuthorInfo.userId;

//   // Show the author's profile picture if they're the blog author and pic is available
//   if (isBlogPostAuthor && blogAuthorInfo.profilePictureUrl && !imageError) {
//     return (
//       <div className="relative">
//         <Image
//           src={blogAuthorInfo.profilePictureUrl}
//           alt={`${user.firstName || ""} ${user.lastName || ""}`}
//           width={size}
//           height={size}
//           className="rounded-full object-cover ring-2 ring-purple-200 shadow-sm cursor-pointer transition-transform hover:scale-105"
//           onError={() => setImageError(true)}
//           onClick={onClick}
//         />
//         {/* Author badge */}
//         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-white">
//           <svg
//             className="w-2 h-2 text-white"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         </div>
//       </div>
//     );
//   }

//   // Show initials with special styling for blog author
//   return (
//     <div
//       className={`rounded-full flex items-center justify-center text-sm font-medium text-white relative cursor-pointer transition-transform hover:scale-105 ${
//         isBlogPostAuthor
//           ? "bg-gradient-to-r from-purple-500 to-pink-500 ring-2 ring-purple-200 shadow-md"
//           : "bg-gradient-to-r from-blue-500 to-purple-500"
//       }`}
//       style={{ width: size, height: size }}
//       onClick={onClick}
//     >
//       {initials}
//       {/* Author badge for initials too */}
//       {isBlogPostAuthor && (
//         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-white">
//           <svg
//             className="w-2 h-2 text-white"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         </div>
//       )}
//     </div>
//   );
// };

// // Loading Skeleton Component
// const CommentSkeleton = () => (
//   <div className="flex gap-3 mb-6 animate-pulse">
//     <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
//     <div className="flex-1 space-y-2">
//       <div className="flex items-center gap-2">
//         <div className="h-4 bg-gray-200 rounded w-24"></div>
//         <div className="h-3 bg-gray-200 rounded w-16"></div>
//       </div>
//       <div className="h-4 bg-gray-200 rounded w-full"></div>
//       <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//       <div className="flex items-center gap-4 mt-2">
//         <div className="h-6 bg-gray-200 rounded w-12"></div>
//         <div className="h-6 bg-gray-200 rounded w-12"></div>
//       </div>
//     </div>
//   </div>
// );

// // Blog Stats Component
// const BlogStats = ({ blogId }: { blogId: string }) => {
//   const { data: stats, isLoading, error } = useBlogStats(blogId);
//   const blogLikeMutation = useBlogLike(blogId);

//   const handleLikeBlog = () => {
//     blogLikeMutation.mutate();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg animate-pulse">
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 bg-gray-200 rounded"></div>
//           <div className="w-8 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 bg-gray-200 rounded"></div>
//           <div className="w-8 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 bg-gray-200 rounded"></div>
//           <div className="w-8 h-4 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
//         Failed to load blog stats
//       </div>
//     );
//   }

//   if (!stats) return null;

//   return (
//     <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg mb-6">
//       <button
//         onClick={handleLikeBlog}
//         disabled={blogLikeMutation.isPending}
//         className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
//           stats.isLiked
//             ? "bg-red-100 text-red-600 hover:bg-red-200"
//             : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600"
//         } ${
//           blogLikeMutation.isPending
//             ? "opacity-50 cursor-not-allowed"
//             : "hover:scale-105"
//         }`}
//       >
//         <Heart
//           size={20}
//           fill={stats.isLiked ? "currentColor" : "none"}
//           className={blogLikeMutation.isPending ? "animate-pulse" : ""}
//         />
//         <span className="font-medium">{stats.likesCount}</span>
//       </button>

//       <div className="flex items-center gap-2 text-gray-600">
//         <Eye size={20} />
//         <span className="font-medium">{stats.viewsCount.toLocaleString()}</span>
//       </div>

//       <div className="flex items-center gap-2 text-gray-600">
//         <MessageCircle size={20} />
//         <span className="font-medium">{stats.commentsCount} comments</span>
//       </div>
//     </div>
//   );
// };

// // Comment Item Component
// const CommentItem = ({
//   comment,
//   isReply = false,
//   session,
//   blogId,
//   topLevelParentId,
//   blogAuthorInfo,
// }: {
//   comment: Comment | CommentReply;
//   isReply?: boolean;
//   session: Session | null;
//   blogId: string;
//   topLevelParentId?: string;
//   blogAuthorInfo: BlogAuthorInfo;
// }) => {
//   const router = useRouter();
//   const [showReplies, setShowReplies] = useState(false);
//   const [showReplyInput, setShowReplyInput] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   // Use custom hooks
//   const commentLikeMutation = useCommentLike(blogId, comment.id);
//   const addReplyMutation = useAddReply(blogId);

//   const handleLikeComment = () => {
//     commentLikeMutation.mutate();
//   };

//   const handleSubmitReply = () => {
//     if (!replyText.trim()) return;

//     const parentIdToUse = topLevelParentId || comment.id;

//     addReplyMutation.mutate({
//       content: replyText,
//       parentId: parentIdToUse,
//       replyingToUserId: comment.author.id,
//       replyingToUserName: `${comment.author.firstName} ${comment.author.lastName}`,
//     });

//     // Reset form on successful submission
//     if (addReplyMutation.isSuccess) {
//       setReplyText("");
//       setShowReplyInput(false);
//     }
//   };

//   const handleUserClick = () => {
//     router.push(`/user/${comment.author.id}`);
//   };

//   // Simple check: is this commenter the blog post author?
//   const isCommentByBlogAuthor = comment.author.id === blogAuthorInfo.userId;

//   return (
//     <div className={`flex gap-3 ${isReply ? "ml-12 mt-3" : "mb-6"}`}>
//       <div className="flex-shrink-0">
//         <UserAvatar
//           user={comment.author}
//           blogAuthorInfo={blogAuthorInfo}
//           size={40}
//           onClick={handleUserClick}
//         />
//       </div>

//       <div className="flex-1 min-w-0">
//         {/* Author of this post indicator */}
//         {isCommentByBlogAuthor && (
//           <div className="mb-2">
//             <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full">
//               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//               Author of this post
//             </span>
//           </div>
//         )}

//         <div className="flex items-center gap-2 mb-1">
//           <button
//             onClick={handleUserClick}
//             className={`font-medium text-sm hover:underline transition-colors ${
//               isCommentByBlogAuthor
//                 ? "text-purple-700 hover:text-purple-800"
//                 : "text-gray-900 hover:text-gray-700"
//             }`}
//           >
//             {comment.author.firstName} {comment.author.lastName}
//           </button>
//           <span className="text-xs text-gray-500">{comment.timeAgo}</span>
//         </div>

//         {/* Show @mention if this is a reply */}
//         <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
//           {comment.replyingTo && (
//             <span className="text-blue-600 font-medium">
//               @{comment.replyingTo.firstName} {comment.replyingTo.lastName}{" "}
//             </span>
//           )}
//           {comment.content
//             .replace(
//               `@${comment.replyingTo?.firstName} ${comment.replyingTo?.lastName}`,
//               ""
//             )
//             .trim()}
//         </div>

//         <div className="flex items-center gap-4 mb-2">
//           <button
//             onClick={handleLikeComment}
//             disabled={commentLikeMutation.isPending}
//             className={`flex items-center gap-1 text-xs hover:bg-gray-100 px-2 py-1 rounded-full transition-colors ${
//               comment.isLiked ? "text-red-600" : "text-gray-600"
//             } ${
//               commentLikeMutation.isPending
//                 ? "opacity-50 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             <Heart
//               size={14}
//               fill={comment.isLiked ? "currentColor" : "none"}
//               className={commentLikeMutation.isPending ? "animate-pulse" : ""}
//             />
//             <span>{comment.likesCount}</span>
//           </button>

//           {session && (
//             <button
//               onClick={() => setShowReplyInput(!showReplyInput)}
//               className="flex items-center gap-1 text-xs text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-full transition-colors"
//             >
//               <Reply size={14} />
//               <span>Reply</span>
//             </button>
//           )}

//           <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1">
//             <Trash2 size={14} />
//             <span className="text-xs font-medium">Delete</span>
//           </button>
//         </div>

//         {showReplyInput && session && (
//           <div className="mt-3 mb-4">
//             <div className="flex gap-3">
//               <div className="flex-shrink-0">
//                 <UserAvatar
//                   user={session.user}
//                   blogAuthorInfo={blogAuthorInfo}
//                   size={32}
//                   onClick={() => router.push(`/user/${session.user.id}`)}
//                 />
//               </div>
//               <div className="flex-1">
//                 <textarea
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                   placeholder={`Reply to ${comment.author.firstName}...`}
//                   className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
//                   rows={2}
//                   disabled={addReplyMutation.isPending}
//                 />
//                 <div className="flex justify-end gap-2 mt-2">
//                   <button
//                     onClick={() => {
//                       setShowReplyInput(false);
//                       setReplyText("");
//                     }}
//                     disabled={addReplyMutation.isPending}
//                     className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSubmitReply}
//                     disabled={!replyText.trim() || addReplyMutation.isPending}
//                     className="px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                   >
//                     {addReplyMutation.isPending ? "Replying..." : "Reply"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Show replies button only for main comments */}
//         {!isReply && comment.repliesCount && comment.repliesCount > 0 && (
//           <button
//             onClick={() => setShowReplies(!showReplies)}
//             className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full mb-2 transition-colors"
//           >
//             {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             <span>
//               {showReplies ? "Hide" : "Show"} {comment.repliesCount}{" "}
//               {comment.repliesCount === 1 ? "reply" : "replies"}
//             </span>
//           </button>
//         )}

//         {/* Replies are only shown for top-level comments, all flattened */}
//         {showReplies && !isReply && "replies" in comment && comment.replies && (
//           <div className="mt-2">
//             {comment.replies.map((reply) => (
//               <CommentItem
//                 key={reply.id}
//                 comment={reply}
//                 isReply={true}
//                 session={session}
//                 blogId={blogId}
//                 topLevelParentId={comment.id}
//                 blogAuthorInfo={blogAuthorInfo}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Main Component
// const LikeAndCommentsInteractionsClient = ({
//   blogId,
//   blogAuthorInfo,
// }: {
//   blogId: string;
//   blogAuthorInfo: BlogAuthorInfo;
// }) => {
//   const { data: session } = useSession() as { data: Session | null };
//   const router = useRouter();
//   const [newComment, setNewComment] = useState("");
//   const [showCommentInput, setShowCommentInput] = useState(false);

//   // Use custom hooks
//   const { data: comments = [], isLoading, error } = useBlogComments(blogId);
//   const addCommentMutation = useAddComment(blogId);

//   const handleSubmitComment = () => {
//     if (!newComment.trim()) return;

//     addCommentMutation.mutate(newComment);

//     // Reset form on successful submission
//     if (addCommentMutation.isSuccess) {
//       setNewComment("");
//       setShowCommentInput(false);
//     }
//   };

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-white">
//         <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
//           Failed to load comments. Please try again.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white">
//       <BlogStats blogId={blogId} />

//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-4">
//           {isLoading ? (
//             <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
//           ) : (
//             `${comments.length} Comments`
//           )}
//         </h3>

//         {session && !isLoading && (
//           <div className="mb-6">
//             <div className="flex gap-3">
//               <div className="flex-shrink-0">
//                 <UserAvatar
//                   user={session.user}
//                   blogAuthorInfo={blogAuthorInfo}
//                   size={40}
//                   onClick={() => router.push(`/user/${session.user.id}`)}
//                 />
//               </div>
//               <div className="flex-1">
//                 <textarea
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   onFocus={() => setShowCommentInput(true)}
//                   placeholder="Add a comment..."
//                   className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all"
//                   rows={showCommentInput ? 3 : 1}
//                   disabled={addCommentMutation.isPending}
//                   maxLength={1000}
//                 />
//                 {showCommentInput && (
//                   <div className="flex justify-between items-center mt-3">
//                     <span className="text-xs text-gray-500">
//                       {newComment.length}/1000 characters
//                     </span>
//                     <div className="flex gap-2">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setShowCommentInput(false);
//                           setNewComment("");
//                         }}
//                         disabled={addCommentMutation.isPending}
//                         className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleSubmitComment}
//                         disabled={
//                           !newComment.trim() ||
//                           addCommentMutation.isPending ||
//                           newComment.length > 1000
//                         }
//                         className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                       >
//                         {addCommentMutation.isPending
//                           ? "Commenting..."
//                           : "Comment"}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {!session && !isLoading && (
//           <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl text-center">
//             <div className="flex justify-center mb-3">
//               <svg
//                 className="w-8 h-8 text-blue-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-3.582 9 8z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               Want to drop a comment?
//             </h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Join the conversation and share your thoughts!
//             </p>
//             <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
//               <Link
//                 href={`/auth/signin?callbackUrl=${encodeURIComponent(
//                   typeof window !== "undefined" ? window.location.href : ""
//                 )}`}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
//               >
//                 Log in to your account
//               </Link>
//               <span className="text-gray-400 text-sm">or</span>
//               <Link
//                 href={`/auth/register?callbackUrl=${encodeURIComponent(
//                   typeof window !== "undefined" ? window.location.href : ""
//                 )}`}
//                 className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Create new account
//               </Link>
//             </div>
//           </div>
//         )}

//         {isLoading && (
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <CommentSkeleton key={i} />
//             ))}
//           </div>
//         )}

//         {!isLoading && (
//           <div className="space-y-4">
//             {comments.length > 0 ? (
//               comments.map((comment) => (
//                 <CommentItem
//                   key={comment.id}
//                   comment={comment}
//                   session={session}
//                   blogId={blogId}
//                   blogAuthorInfo={blogAuthorInfo}
//                 />
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <MessageCircle
//                   size={48}
//                   className="mx-auto text-gray-400 mb-4"
//                 />
//                 <p className="text-gray-600">
//                   No comments yet. Be the first to comment!
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LikeAndCommentsInteractionsClient;

/**
 *
 * For this blogs I would be keeping a lot of code around cos me I still dey learn, I go dey come back from time to time to read the code walahi
 */

/**
 * 
 * Sincerely this is not clean or organized, but first things first is I have to ship it out, the rest can come in future updates
 */

"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Reply,
  Eye,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useBlogStats,
  useBlogCommentsInfinite, // Changed from useBlogComments
  useBlogLike,
  useCommentLikeInfinite, // Changed from useCommentLike
  useAddCommentInfinite, // Changed from useAddComment
  useAddReplyInfinite, // Changed from useAddReply
  type Comment,
  type CommentReply,
  type BlogStats as BlogStatsType,
  useDeleteCommentInfinite,
} from "../../../hooks/useBlogPage";
import InfiniteScrollContainer from "@/components/infiniteScrollContainer";

interface User {
  name: string;
  email: string;
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  isAuthor: boolean;
  isVerified: boolean;
}

interface Session {
  user: User;
  expires: string; // ISO date string
}

interface BlogAuthorInfo {
  userId: string;
  profilePictureUrl: string;
  firstName: string;
  lastName: string;
}

// User Avatar Component - Keep your existing one
const UserAvatar = ({
  user,
  size = 40,
  blogAuthorInfo,
  onClick,
}: {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  size?: number;
  blogAuthorInfo: BlogAuthorInfo;
  onClick?: () => void;
}) => {
  const [imageError, setImageError] = useState(false);

  const initials =
    (user?.firstName?.charAt(0) || "") + (user?.lastName?.charAt(0) || "");

  // Check if this user is the blog post author
  const isBlogPostAuthor = user.id === blogAuthorInfo.userId;

  // Show the author's profile picture if they're the blog author and pic is available
  if (isBlogPostAuthor && blogAuthorInfo.profilePictureUrl && !imageError) {
    return (
      <div className="relative">
        <Image
          src={blogAuthorInfo.profilePictureUrl}
          alt={`${user.firstName || ""} ${user.lastName || ""}`}
          width={size}
          height={size}
          className="rounded-full object-cover ring-2 ring-purple-200 shadow-sm cursor-pointer transition-transform hover:scale-105"
          onError={() => setImageError(true)}
          onClick={onClick}
        />
        {/* Author badge */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-white">
          <svg
            className="w-2 h-2 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
    );
  }

  // Show initials with special styling for blog author
  return (
    <div
      className={`rounded-full flex items-center justify-center text-sm font-medium text-white relative cursor-pointer transition-transform hover:scale-105 ${
        isBlogPostAuthor
          ? "bg-gradient-to-r from-purple-500 to-pink-500 ring-2 ring-purple-200 shadow-md"
          : "bg-gradient-to-r from-blue-500 to-purple-500"
      }`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {initials}
      {/* Author badge for initials too */}
      {isBlogPostAuthor && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-white">
          <svg
            className="w-2 h-2 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
    </div>
  );
};

// Loading Skeleton Component - Keep your existing one
const CommentSkeleton = () => (
  <div className="flex gap-3 mb-6 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="flex items-center gap-4 mt-2">
        <div className="h-6 bg-gray-200 rounded w-12"></div>
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

// Blog Stats Component - Keep your existing one
const BlogStats = ({ blogId }: { blogId: string }) => {
  const { data: stats, isLoading, error } = useBlogStats(blogId);
  const blogLikeMutation = useBlogLike(blogId);

  const handleLikeBlog = () => {
    blogLikeMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        Failed to load blog stats
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg mb-6">
      <button
        onClick={handleLikeBlog}
        disabled={blogLikeMutation.isPending}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
          stats.isLiked
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600"
        } ${
          blogLikeMutation.isPending
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105"
        }`}
      >
        <Heart
          size={20}
          fill={stats.isLiked ? "currentColor" : "none"}
          className={blogLikeMutation.isPending ? "animate-pulse" : ""}
        />
        <span className="font-medium">{stats.likesCount}</span>
      </button>

      <div className="flex items-center gap-2 text-gray-600">
        <Eye size={20} />
        <span className="font-medium">{stats.viewsCount.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <MessageCircle size={20} />
        <span className="font-medium">{stats.commentsCount} comments</span>
      </div>
    </div>
  );
};

// Updated Comment Item Component with infinite hooks
const CommentItem = ({
  comment,
  isReply = false,
  session,
  blogId,
  topLevelParentId,
  blogAuthorInfo,
}: {
  comment: Comment | CommentReply;
  isReply?: boolean;
  session: Session | null;
  blogId: string;
  topLevelParentId?: string;
  blogAuthorInfo: BlogAuthorInfo;
}) => {
  const router = useRouter();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Updated to use infinite hooks
  const commentLikeMutation = useCommentLikeInfinite(blogId, comment.id);
  const addReplyMutation = useAddReplyInfinite(blogId);
  const deleteCommentMutation = useDeleteCommentInfinite(blogId);

  const handleLikeComment = () => {
    commentLikeMutation.mutate();
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    const parentIdToUse = topLevelParentId || comment.id;

    try {
      await addReplyMutation.mutateAsync({
        content: replyText,
        parentId: parentIdToUse,
        replyingToUserId: comment.author.id,
        replyingToUserName: `${comment.author.firstName} ${comment.author.lastName}`,
      });

      setReplyText("");
      setShowReplyInput(false);
    } catch (error) {
      console.error("Failed to submit reply:", error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteCommentMutation.mutateAsync(comment.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleUserClick = () => {
    router.push(`/user/${comment.author.id}`);
  };

  // Check if current user can delete this comment
  const canDelete = session?.user?.id === comment.author.id;
  const isCommentByBlogAuthor = comment.author.id === blogAuthorInfo.userId;

  return (
    <div className={`flex gap-3 ${isReply ? "ml-12 mt-3" : "mb-6"}`}>
      <div className="flex-shrink-0">
        <UserAvatar
          user={comment.author}
          blogAuthorInfo={blogAuthorInfo}
          size={40}
          onClick={handleUserClick}
        />
      </div>

      <div className="flex-1 min-w-0">
        {/* Author of this post indicator */}
        {isCommentByBlogAuthor && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Author of this post
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={handleUserClick}
            className={`font-medium text-sm hover:underline transition-colors ${
              isCommentByBlogAuthor
                ? "text-purple-700 hover:text-purple-800"
                : "text-gray-900 hover:text-gray-700"
            }`}
          >
            {comment.author.firstName} {comment.author.lastName}
          </button>
          <span className="text-xs text-gray-500">{comment.timeAgo}</span>
        </div>

        {/* Comment content with mention detection */}
        <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
          {(() => {
            let mention: { firstName: string; lastName: string } | null = null;
            let content = comment.content.trim();

            if (comment.replyingTo) {
              mention = {
                firstName: comment.replyingTo.firstName,
                lastName: comment.replyingTo.lastName,
              };
              const mentionText = `@${mention.firstName} ${mention.lastName}`;
              content = content.replace(mentionText, "").trim();
            } else {
              const mentionMatch = content.match(/^@(\w+)\s+(\w+)/);
              if (mentionMatch) {
                mention = {
                  firstName: mentionMatch[1],
                  lastName: mentionMatch[2],
                };
                content = content.replace(mentionMatch[0], "").trim();
              }
            }

            return (
              <>
                {mention && (
                  <span className="text-blue-600 font-medium">
                    @{mention.firstName} {mention.lastName}{" "}
                  </span>
                )}
                {content}
              </>
            );
          })()}
        </div>

        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={handleLikeComment}
            disabled={commentLikeMutation.isPending}
            className={`flex items-center gap-1 text-xs hover:bg-gray-100 px-2 py-1 rounded-full transition-colors ${
              comment.isLiked ? "text-red-600" : "text-gray-600"
            } ${
              commentLikeMutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <Heart
              size={14}
              fill={comment.isLiked ? "currentColor" : "none"}
              className={commentLikeMutation.isPending ? "animate-pulse" : ""}
            />
            <span>{comment.likesCount > 0 ? comment.likesCount : ""}</span>
          </button>

          {session && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 text-xs text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-full transition-colors"
            >
              <Reply size={14} />
              <span>Reply</span>
            </button>
          )}

          {/* Delete button - only show if user can delete */}
          {canDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteCommentMutation.isPending}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span className="text-xs font-medium">Delete</span>
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Comment
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete this comment?
                {comment.repliesCount > 0 && (
                  <span className="text-red-600 font-medium">
                    {" "}
                    This will also delete all {comment.repliesCount} replies to
                    this comment.
                  </span>
                )}{" "}
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteCommentMutation.isPending}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteComment}
                  disabled={deleteCommentMutation.isPending}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
                >
                  {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reply input */}
        {showReplyInput && session && (
          <div className="mt-3 mb-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <UserAvatar
                  user={session.user}
                  blogAuthorInfo={blogAuthorInfo}
                  size={32}
                  onClick={() => router.push(`/user/${session.user.id}`)}
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.author.firstName}...`}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                  rows={2}
                  disabled={addReplyMutation.isPending}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setShowReplyInput(false);
                      setReplyText("");
                    }}
                    disabled={addReplyMutation.isPending}
                    className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim() || addReplyMutation.isPending}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {addReplyMutation.isPending ? "Replying..." : "Reply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show replies button only for main comments */}
        {!isReply &&  comment.repliesCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full mb-2 transition-colors"
          >
            {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>
              {showReplies ? "Hide" : "Show"} {comment.repliesCount}{" "}
              {comment.repliesCount === 1 ? "reply" : "replies"}
            </span>
          </button>
        )}

        {/* Replies */}
        {showReplies && !isReply && "replies" in comment && comment.replies && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply={true}
                session={session}
                blogId={blogId}
                topLevelParentId={comment.id}
                blogAuthorInfo={blogAuthorInfo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component - Updated to use infinite scroll
const LikeAndCommentsInteractionsClient = ({
  blogId,
  blogAuthorInfo,
}: {
  blogId: string;
  blogAuthorInfo: BlogAuthorInfo;
}) => {
  const { data: session } = useSession() as { data: Session | null };
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  // Updated to use infinite hooks
  const {
    comments,
    metadata,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isEmpty,
  } = useBlogCommentsInfinite(blogId);

  const addCommentMutation = useAddCommentInfinite(blogId);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addCommentMutation.mutateAsync(newComment);
      // Reset form on successful submission
      setNewComment("");
      setShowCommentInput(false);
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to submit comment:", error);
    }
  };

  const handleLoadMoreComments = () => {
    fetchNextPage();
  };

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          Failed to load comments. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <BlogStats blogId={blogId} />

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          ) : (
            `${metadata?.totalCount || comments.length} Comments`
          )}
        </h3>

        {session && !isLoading && (
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <UserAvatar
                  user={session.user}
                  blogAuthorInfo={blogAuthorInfo}
                  size={40}
                  onClick={() => router.push(`/user/${session.user.id}`)}
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onFocus={() => setShowCommentInput(true)}
                  placeholder="Add a comment..."
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all"
                  rows={showCommentInput ? 3 : 1}
                  disabled={addCommentMutation.isPending}
                  maxLength={1000}
                />
                {showCommentInput && (
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {newComment.length}/1000 characters
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCommentInput(false);
                          setNewComment("");
                        }}
                        disabled={addCommentMutation.isPending}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitComment}
                        disabled={
                          !newComment.trim() ||
                          addCommentMutation.isPending ||
                          newComment.length > 1000
                        }
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {addCommentMutation.isPending
                          ? "Commenting..."
                          : "Comment"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!session && !isLoading && (
          <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl text-center">
            <div className="flex justify-center mb-3">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Want to drop a comment?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Join the conversation and share your thoughts!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href={`/auth/signin?callbackUrl=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Log in to your account
              </Link>
              <span className="text-gray-400 text-sm">or</span>
              <Link
                href={`/auth/register?callbackUrl=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Create new account
              </Link>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            {comments.length > 0 ? (
              <div>
                <InfiniteScrollContainer
                  onBottomReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                      return fetchNextPage();
                    }
                    return;
                  }}
                >
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      session={session}
                      blogId={blogId}
                      blogAuthorInfo={blogAuthorInfo}
                    />
                  ))}
                </InfiniteScrollContainer>

                {/* Load More Button */}
              </div>
            ) : isEmpty ? (
              <div className="text-center py-8">
                <MessageCircle
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <p className="text-gray-600">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : <></>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeAndCommentsInteractionsClient;
