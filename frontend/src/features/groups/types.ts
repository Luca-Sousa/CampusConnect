export interface GroupAuthor {
  id: string;
  name: string;
  image: string | null;
  cargo: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: GroupAuthor | null;
  memberCount: number;
  isMember: boolean;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author: GroupAuthor | null;
}
