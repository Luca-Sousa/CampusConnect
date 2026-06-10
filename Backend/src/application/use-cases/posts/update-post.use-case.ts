import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import type {
  Post,
  UpdatePostInput,
} from "../../../domain/entities/post.js";
import type { ContentModerator } from "../../services/content-moderator.js";
import { NotFoundError } from "../../../domain/errors/not-found.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";

export interface UpdatePostCommand {
  postId: string;
  userId: string;
  userRole: string;
  input: UpdatePostInput;
}

/**
 * Caso de uso: edição de publicação com moderação AI.
 *
 * Responsabilidades (SRP):
 *  1. Verificar existência e autorização (autor ou admin).
 *  2. Delegar moderação ao `ContentModerator` quando o conteúdo é alterado.
 *  3. Atualizar o post via repositório.
 *
 * Dependências (DIP):
 *  - `IPostRepository` (porta de persistência).
 *  - `ContentModerator` (service de moderação — depende de `IAIService`).
 *
 * Regras de moderação (mesmas da criação):
 *  - Se `content` não está sendo alterado → sem moderação.
 *  - Texto aceitável → limpa flags de moderação.
 *  - Spam / toxicidade leve → retido (`moderated: true`).
 *  - Toxicidade grave → bloqueado (erro `INVALID:`).
 */
export class UpdatePostUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly contentModerator: ContentModerator,
  ) {}

  async execute(command: UpdatePostCommand): Promise<Post> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new NotFoundError();
    }

    if (post.authorId !== command.userId && command.userRole !== "admin") {
      throw new ForbiddenError();
    }

    // Moderar apenas se o conteúdo está sendo alterado
    if (command.input.content !== undefined) {
      const moderation = await this.contentModerator.moderate(
        command.input.content ?? "",
      );

      return this.postRepository.update(command.postId, {
        ...command.input,
        moderated: moderation.moderated,
        moderationReasons: moderation.moderationReasons,
      });
    }

    return this.postRepository.update(command.postId, command.input);
  }
}
