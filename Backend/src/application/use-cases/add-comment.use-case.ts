import type { Comment } from "../../domain/entities/comment.js";
import type { ICommentRepository } from "../../domain/ports/repositories/comment-repository.js";
import { InvalidError } from "../../domain/errors/invalid.js";

export class AddCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(input: {
    postId: string;
    authorId: string;
    parentId?: string;
    content: string;
  }): Promise<Comment> {
    if (input.parentId) {
      const parent = await this.commentRepository.findById(input.parentId);
      if (!parent || parent.postId !== input.postId) {
        throw new InvalidError("Comentário pai não encontrado.");
      }
    }

    return this.commentRepository.create(input);
  }
}
