export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  course: string | null;
  bio: string | null;
  role: string;
  cargo: string;
}

export interface UpdateProfileInput {
  name?: string;
  image?: string | null;
  course?: string | null;
  bio?: string | null;
}
