import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import type { Post, CreatePostInput } from "../../../domain/entities/post.js";
import { OFFICIAL_CARGOS } from "../../constants/permissions.js";
import type { ContentModerator } from "../../services/content-moderator.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";

export interface CreatePostCommand extends CreatePostInput {
  userRole: string;
  userCargo: string;
}

/**
 * Caso de uso: criação de publicação com moderação AI.
 *
 * Responsabilidades (SRP):
 *  1. Validar permissões de tipo por role/cargo.
 *  2. Delegar moderação e tags ao `ContentModerator`.
 *  3. Persistir o post via repositório.
 *
 * Dependências (DIP):
 *  - `IPostRepository` (porta de persistência).
 *  - `ContentModerator` (service de moderação — depende de `IAIService`).
 *
 * Regras de moderação (centralizadas no `ContentModerator`):
 *  - Texto aceitável → publicação imediata com tags AI.
 *  - Spam / toxicidade leve → retido para moderação (`moderated: true`).
 *  - Toxicidade grave → bloqueado (erro `INVALID:`).
 */
export class CreatePostUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly contentModerator: ContentModerator,
  ) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    this.assertTypePermissions(command);

    const textToCheck = command.content ?? "";
    const moderation = await this.contentModerator.moderate(textToCheck);

    const createInput: CreatePostInput = {
      ...command,
      tags: moderation.tags,
      moderated: moderation.moderated,
      moderationReasons: moderation.moderationReasons,
    };

    return this.postRepository.create(createInput);
  }

  private assertTypePermissions(command: CreatePostCommand): void {
    if (command.userRole === "aluno") {
      if (command.type === "event") {
        throw new ForbiddenError("Alunos não podem criar eventos.");
      }
      if (command.type === "news") {
        throw new ForbiddenError("Apenas perfis oficiais podem publicar notícias.");
      }
    }

    if (
      command.type === "news" &&
      command.userRole !== "admin" &&
      !OFFICIAL_CARGOS.has(command.userCargo)
    ) {
      throw new ForbiddenError();
    }
  }
}
