
export interface Message {
    id:number;
    content:string;
    mine:boolean;
    date:string;
}

export interface SendMessage{
    content:string;
    conversation_id:number;
}

export interface MessageResponse<T>{
    message:string;
    data:T
}