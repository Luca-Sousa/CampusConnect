import type { ToggleLikeResult } from "../../domain/entities/like.js";
import type { ILikeRepository } from "../../domain/ports/repositories/like-repository.js";

export class ToggleLikeUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(input: {
    postId: string;
    userId: string;
  }): Promise<ToggleLikeResult> {
    return this.likeRepository.toggle(input.postId, input.userId);
  }
}
