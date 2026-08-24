export interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  imageUrl: string;
  readTime: string;
  likes: number;
  views: number;
  isTop: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface BlogData {
  posts: Post[];
  subscribers: string[];
}

export type PostInput = Omit<
  Post,
  "id" | "slug" | "likes" | "views" | "createdAt" | "comments"
> & {
  slug?: string;
};
