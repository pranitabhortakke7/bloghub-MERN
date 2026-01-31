export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface DraftVersion {
  id: string;
  content: string;
  title: string;
  timestamp: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  authorId: string;
  author: User;
  tags: string[];
  published: boolean;
  scheduledPublishDate?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  draftVersions?: DraftVersion[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

export type Page = 
  | 'home' 
  | 'post' 
  | 'create' 
  | 'edit' 
  | 'login' 
  | 'signup' 
  | 'profile' 
  | 'dashboard'
  | 'reading-list'
  | "user-profile"
  | "followers"     // 👈 ADD
  | "following"
  | "following-feed";