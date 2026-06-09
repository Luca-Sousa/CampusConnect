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
  tags?: string[] | null;
  moderated?: boolean;
  moderationReasons?: string[] | null;
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
  eventEndTime: string | null;
  eventLocation: string;
  imageUrl: string | null;
  rsvpCount: number;
  hasRsvp: boolean;
}

export interface NewsPost extends PostBase {
  type: "news";
  newsTitle: string;
  imageUrl: string | null;
}

export type Post = TextPost | ImagePost | EventPost | NewsPost;


// ——— Likes ———

export interface ToggleLikeResult {
  hasLiked: boolean;
  likesCount: number;
}

// ——— Comments ———

export interface CommentAuthor {
  id: string;
  name: string;
  image: string | null;
  cargo: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor | null;
  replies?: Comment[];
}
