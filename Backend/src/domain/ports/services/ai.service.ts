export interface ModerationCategory {
  name: string;
  score: number; // 0-1
}

export interface ModerationResult {
  allowed: boolean;
  categories: ModerationCategory[];
  reasons?: string[];
}

export interface TagSuggestion {
  tag: string;
  score: number; // 0-1
}

export interface IAIService {
  moderate(text: string): Promise<ModerationResult>;
  suggestTags(text: string, limit?: number): Promise<TagSuggestion[]>;
}
