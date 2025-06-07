// @/sanity/interfaces/commentInterfaces.ts

export interface CommentAuthor {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  image?: string;
}

export interface CommentLike {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface CommentReply {
  _id: string;
  _createdAt: string;
  content: string;
  author: CommentAuthor;
  likes: CommentLike[];
  likesCount: number;
}

export interface BlogPostReference {
  _id: string;
  title: string;
}

export interface CommentListItem {
  _id: string;
  _createdAt: string;
  content: string;
  author: CommentAuthor;
  blogPost: BlogPostReference;
  likes: CommentLike[];
  likesCount: number;
  repliesCount: number;
  replies: CommentReply[];
}

// For server actions
export interface CreateCommentData {
  content: string;
  blogPostId: string;
  authorId: string;
  parentCommentId?: string;
}

export interface LikeCommentData {
  commentId: string;
  userId: string;
}
