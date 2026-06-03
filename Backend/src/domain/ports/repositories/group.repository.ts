import type {
  Group,
  GroupWithAuthor,
  CreateGroupInput,
  UpdateGroupInput,
  GroupMessageWithAuthor,
} from "../../entities/group.js";

export interface ListGroupsOptions {
  limit: number;
  offset: number;
  currentUserId?: string;
  search?: string;
}

export interface ListMessagesOptions {
  groupId: string;
  limit: number;
  offset: number;
}

export interface IGroupRepository {
  create(input: CreateGroupInput): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  findMany(options: ListGroupsOptions): Promise<GroupWithAuthor[]>;
  update(id: string, input: UpdateGroupInput): Promise<Group>;
  delete(id: string): Promise<void>;
  addMember(groupId: string, userId: string): Promise<void>;
  removeMember(groupId: string, userId: string): Promise<void>;
  findMember(
    groupId: string,
    userId: string,
  ): Promise<{ id: string } | null>;
  findMessages(
    options: ListMessagesOptions,
  ): Promise<GroupMessageWithAuthor[]>;
  createMessage(
    groupId: string,
    authorId: string,
    content: string,
  ): Promise<GroupMessageWithAuthor>;
  deleteMessage(id: string, userId: string): Promise<void>;
  isAuthorOrAdmin(
    groupId: string,
    userId: string,
    userRole: string,
  ): Promise<boolean>;
}
