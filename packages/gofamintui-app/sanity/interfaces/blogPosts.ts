

// Updated interfaces
interface FeaturedImage {
  asset: {
    _id: string;
    url: string;
    metadata: {
      lqip: string;
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
  alt: string;
}

interface Author {
  firstName: string;
  lastName: string;
}

interface Slug{
    current: string;
    _type: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: Slug;
  excerpt: string;
  featuredImage: FeaturedImage;
  author: Author;
  publishedAt: string; // ISO date string when the post was published
  _createdAt: string; // ISO date string when the document was created
  _updatedAt: string; // ISO date string when the document was last updated
  readingTime: number;
  featured: boolean;
  likes: number; // Number of likes the post has received
  viewsCount: number; // Number of times the post has been viewed
  commentsCount: number;
}
