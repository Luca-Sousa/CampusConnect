import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import { NotFoundError } from "../../../domain/errors/not-found.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";
import { OFFICIAL_CARGOS } from "../../constants/permissions.js";

export interface RejectPostCommand {
  postId: string;
  userId: string;
  userRole: string;
  userCargo: string;
}

export interface RejectPostResult {
  authorId: string;
}

/**
 * Rejeita uma publicação retida pela moderação.
 *
 * Quem pode rejeitar:
 *  - Admin (qualquer admin)
 *  - Colaborador com cargo oficial (direção, administração, coordenador, centro acadêmico)
 *
 * A rejeição deleta o post e notifica o autor.
 */
export class RejectPostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: RejectPostCommand): Promise<RejectPostResult> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new NotFoundError();
    }

    const canReject =
      command.userRole === "admin" ||
      (command.userRole === "colaborador" &&
        OFFICIAL_CARGOS.has(command.userCargo));

    if (!canReject) {
      throw new ForbiddenError();
    }

    await this.postRepository.delete(command.postId);

    return { authorId: post.authorId };
  }
}
