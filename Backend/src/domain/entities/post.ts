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
  eventEndTime: string | null;
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
  eventEndTime?: string | null;
  eventLocation?: string | null;
  newsTitle?: string | null;
}

/**
 * Campos editáveis de uma publicação. O `type` e o `authorId` são fixos —
 * definidos na criação e imutáveis daqui em diante. Cada propriedade é
 * opcional para suportar updates parciais (PATCH-like), mas a rota HTTP
 * normalmente envia apenas os campos que fazem sentido para o tipo atual.
 */
export interface UpdatePostInput {
  content?: string | null;
  imageUrl?: string | null;
  eventTitle?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  eventEndTime?: string | null;
  eventLocation?: string | null;
  newsTitle?: string | null;
}
