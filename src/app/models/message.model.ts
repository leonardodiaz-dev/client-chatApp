
export interface Message {
    id:number;
    content:string;
    mine:boolean;
    status:string;
    user_id:number;
    date:string;
    conversation_id?:number;
}

export interface SendMessage{
    content:string;
    conversation_id:number;
}

export interface MessageResponse<T>{
    message:string;
    data:T
}