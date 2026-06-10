import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import type { Post } from "../../../domain/entities/post.js";
import { OFFICIAL_CARGOS } from "../../constants/permissions.js";
import { NotFoundError } from "../../../domain/errors/not-found.js";
import { ForbiddenError } from "../../../domain/errors/forbidden.js";

export interface ApprovePostCommand {
  postId: string;
  userId: string;
  userRole: string;
  userCargo: string;
}

/**
 * Aprova uma publicação retida pela moderação.
 *
 * Quem pode aprovar:
 *  - Admin (qualquer admin)
 *  - Colaborador com cargo oficial (direção, administração, coordenador, centro acadêmico)
 */
export class ApprovePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: ApprovePostCommand): Promise<Post> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new NotFoundError();
    }

    const canApprove =
      command.userRole === "admin" ||
      (command.userRole === "colaborador" &&
        OFFICIAL_CARGOS.has(command.userCargo));

    if (!canApprove) {
      throw new ForbiddenError();
    }

    return this.postRepository.update(command.postId, {
      moderated: false,
      moderationReasons: [],
    });
  }
}
