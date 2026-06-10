import type {
  Post,
  PostWithAuthor,
  CreatePostInput,
  UpdatePostInput,
} from "../../entities/post.js";

export interface ListPostsOptions {
  limit: number;
  offset: number;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserCargo?: string;
}

export interface IPostRepository {
  create(input: CreatePostInput): Promise<Post>;
  findById(id: string): Promise<Pick<Post, "id" | "authorId" | "type" | "moderated"> & { authorName: string } | null>;
  findMany(options: ListPostsOptions): Promise<PostWithAuthor[]>;
  update(id: string, input: UpdatePostInput): Promise<Post>;
  delete(id: string): Promise<void>;
  findRsvp(postId: string, userId: string): Promise<{ id: string } | null>;
  createRsvp(postId: string, userId: string): Promise<void>;
  deleteRsvp(rsvpId: string): Promise<void>;
}
