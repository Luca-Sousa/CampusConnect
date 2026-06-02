export type PostType = "text" | "image" | "event" | "news";

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  content: string | null;
  imageUrl: string | null;
  eventTitle: string | null;
  eventDate: string | null;
  eventTime: string | null;
  eventLocation: string | null;
  newsTitle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostAuthorInfo {
  id: string;
  name: string;
  cargo: string;
}

export interface PostWithAuthor extends Post {
  author: PostAuthorInfo | null;
  rsvpCount: number;
  hasRsvp: boolean;
}

export interface CreatePostInput {
  authorId: string;
  type: PostType;
  content?: string | null;
  imageUrl?: string | null;
  eventTitle?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  eventLocation?: string | null;
  newsTitle?: string | null;
}
