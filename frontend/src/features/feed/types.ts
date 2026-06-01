export interface PostAuthor {
  id: string;
  name: string;
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
  type: "text";
}

export interface ImagePost extends PostBase {
  type: "image";
  imageUrl: string;
}

export interface EventPost extends PostBase {
  type: "event";
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  rsvpCount: number;
  hasRsvp: boolean;
}

export interface NewsPost extends PostBase {
  type: "news";
  newsTitle: string;
}

export type Post = TextPost | ImagePost | EventPost | NewsPost;
