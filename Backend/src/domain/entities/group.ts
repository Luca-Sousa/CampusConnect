export interface GroupAuthorInfo {
  id: string;
  name: string;
  cargo: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupWithAuthor extends Group {
  author: GroupAuthorInfo | null;
  memberCount: number;
  isMember: boolean;
}

export interface CreateGroupInput {
  name: string;
  description?: string | null;
  authorId: string;
}

export interface UpdateGroupInput {
  name?: string;
  description?: string | null;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface GroupMessageWithAuthor extends GroupMessage {
  author: GroupAuthorInfo | null;
}
