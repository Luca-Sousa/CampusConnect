export interface Story {
  id: number;
  name: string;
  initials: string;
  from: string;
  to: string;
}

export interface PostImage {
  gradient: string;
  aspect: string;
}

export interface Post {
  id: number;
  author: string;
  initials: string;
  avatarFrom: string;
  avatarTo: string;
  time: string;
  content: string;
  images: PostImage[];
}
