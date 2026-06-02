import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";

export interface ToggleRsvpCommand {
  postId: string;
  userId: string;
}

export interface ToggleRsvpResult {
  hasRsvp: boolean;
}

export class ToggleRsvpUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: ToggleRsvpCommand): Promise<ToggleRsvpResult> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new Error("NOT_FOUND");
    }

    if (post.type !== "event") {
      throw new Error("INVALID: RSVP só é válido para eventos.");
    }

    const existingRsvp = await this.postRepository.findRsvp(
      command.postId,
      command.userId,
    );

    if (existingRsvp) {
      await this.postRepository.deleteRsvp(existingRsvp.id);
      return { hasRsvp: false };
    }

    await this.postRepository.createRsvp(command.postId, command.userId);
    return { hasRsvp: true };
  }
}
