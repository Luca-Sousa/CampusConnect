import type {
  IPostRepository,
  ListPostsOptions,
} from "../../../domain/ports/repositories/post.repository.js";
import type { PostWithAuthor } from "../../../domain/entities/post.js";

export class ListPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(options: ListPostsOptions): Promise<PostWithAuthor[]> {
    return this.postRepository.findMany(options);
  }
}
