export interface FormConversation {
  type: 'private' | 'group';
  user_id: number;
}

export interface Conversation {
  id: number;
  type: 'private' | 'group';
  users: {
    id: number;
    name: string;
    lastname: string;
  };
}
export interface ConversationResponse {
  message:string;
  data:Conversation[]
}
