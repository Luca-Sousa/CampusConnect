import type { IPostRepository } from "../../../domain/ports/repositories/post.repository.js";
import type {
  Post,
  UpdatePostInput,
} from "../../../domain/entities/post.js";

export interface UpdatePostCommand {
  postId: string;
  userId: string;
  userRole: string;
  input: UpdatePostInput;
}

/**
 * Edita uma publicação existente.
 *
 * Regras de autorização (espelhadas de `DeletePostUseCase`):
 *  - O post precisa existir (`NOT_FOUND` caso contrário).
 *  - Apenas o autor original ou um admin pode editar (`FORBIDDEN`).
 *
 * Observação: o `type` do post é decidido na criação e NÃO pode ser alterado
 * aqui. A rota HTTP não aceita `type` no body do PUT; a UI também não oferece
 * essa opção. Permissões de "news" não são revalidadas porque o post já
 * existe e seu tipo é imutável.
 */
export class UpdatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(command: UpdatePostCommand): Promise<Post> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new Error("NOT_FOUND");
    }

    if (post.authorId !== command.userId && command.userRole !== "admin") {
      throw new Error("FORBIDDEN");
    }

    return this.postRepository.update(command.postId, command.input);
  }
}
