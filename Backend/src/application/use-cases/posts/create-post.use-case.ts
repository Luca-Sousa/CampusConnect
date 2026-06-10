import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import type { Post, CreatePostInput } from "../../../domain/entities/post.js";
import { OFFICIAL_CARGOS } from "../../constants/permissions.js";
import { aiService } from "../../../infrastructure/ai/groq-ai.service.js";

export interface CreatePostCommand extends CreatePostInput {
  userRole: string;
  userCargo: string;
}

export class CreatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    if (command.type === "news") {
      if (
        command.userRole !== "admin" &&
        !OFFICIAL_CARGOS.has(command.userCargo)
      ) {
        throw new Error("FORBIDDEN");
      }
    }

    // If there's textual content, run moderation first
    const textToCheck = command.content ?? "";
    if (textToCheck.trim().length > 0) {
      const mod = await aiService.moderate(textToCheck);
      if (!mod.allowed) {
        // mark as moderated and save reasons, do not publish
        const createInput: CreatePostInput = {
          ...command,
          tags: [],
          moderated: true,
          moderationReasons: mod.reasons ?? [],
        };
        return this.postRepository.create(createInput);
      }

      // If allowed, get tag suggestions
      const suggestions = await aiService.suggestTags(textToCheck, 5);
      const tags = suggestions.map((s) => s.tag);

      const createInput: CreatePostInput = {
        ...command,
        tags,
        moderated: false,
      };

      return this.postRepository.create(createInput);
    }

    return this.postRepository.create(command);
  }
}
