export interface FormConversation {
  type: 'private' | 'group';
  name: string;
  user_ids: number[];
}

export interface Conversation {
  id: number;
  type: 'private' | 'group';
  name: string;
  last_message: string;
  last_date: string;
}

export interface ConversationWithCount {
  id: number;
  type: 'private' | 'group';
  name: string;
  last_message: string;
  last_date: string;
  messages_count:number;
}

export interface ConversationResponse<T> {
  message: string;
  data: T;
}
