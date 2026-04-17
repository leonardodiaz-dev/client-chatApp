import { User } from "./user.model";

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
  messages_count?:number;
  avatar:string;
  users?:User[]
}

export interface UpdateConversation {
  conversation_id:string;
  user_ids:string;
}

export interface ConversationResponse<T> {
  message: string;
  data: T;
}
