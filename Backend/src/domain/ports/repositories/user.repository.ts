import type { User } from "../../entities/user.js";

export interface UpdateUserProfileInput {
  name?: string | null;
  image?: string | null;
  course?: string | null;
  bio?: string | null;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  updateProfile(id: string, input: UpdateUserProfileInput): Promise<User>;
}
