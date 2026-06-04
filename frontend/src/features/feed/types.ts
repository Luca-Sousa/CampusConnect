export interface PostAuthor {
  id: string;
  name: string;
  image: string | null;
  cargo: string | null;
}

interface PostBase {
  id: string;
  authorId: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor | null;
}

export interface TextPost extends PostBase {
  commentsCount: number;
  hasLiked: boolean | undefined;
  sharesCount: number;
  likesCount: number;
  type: "text";
}

export interface ImagePost extends PostBase {
  sharesCount: number;
  hasLiked: boolean | undefined;
  commentsCount: number;
  likesCount: number;
  type: "image";
  imageUrl: string;
}

export interface EventPost extends PostBase {
  hasLiked: boolean | undefined;
  sharesCount: number;
  commentsCount: number;
  likesCount: number;
  type: "event";
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventEndTime: string | null;
  eventLocation: string;
  imageUrl: string | null;
  rsvpCount: number;
  hasRsvp: boolean;
}

export interface NewsPost extends PostBase {
  hasLiked: boolean | undefined;
  sharesCount: number;
  commentsCount: number;
  likesCount: number;
  type: "news";
  newsTitle: string;
  imageUrl: string | null;
}

export type Post = TextPost | ImagePost | EventPost | NewsPost;
