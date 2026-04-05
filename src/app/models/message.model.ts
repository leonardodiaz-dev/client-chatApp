
export interface Message {
    id:number;
    content:string;
    mine:boolean;
    time:string;
}

export interface SendMessage{
    content:string;
    conversation_id:number;
}

export interface MessageResponse<T>{
    message:string;
    data:T
}