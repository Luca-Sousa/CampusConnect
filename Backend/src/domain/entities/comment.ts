export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentAuthor {
  id: string;
  name: string;
  image: string | null;
  cargo: string | null;
}

export interface CommentWithAuthor extends Comment {
  author: CommentAuthor | null;
  replies?: CommentWithAuthor[];
}

export interface CommentStats {
  commentsCount: number;
}
