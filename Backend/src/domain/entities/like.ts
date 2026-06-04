export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
}

export interface ToggleLikeResult {
  hasLiked: boolean;
  likesCount: number;
}
