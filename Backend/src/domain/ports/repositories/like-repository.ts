import type { Like, ToggleLikeResult } from "../../entities/like.js";

export interface ILikeRepository {
  toggle(postId: string, userId: string): Promise<ToggleLikeResult>;
  countByPostId(postId: string): Promise<number>;
  hasUserLiked(postId: string, userId: string): Promise<boolean>;
  findByPostAndUser(postId: string, userId: string): Promise<Like | null>;
}
