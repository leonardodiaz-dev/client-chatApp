
export interface FormUser {
    name:string | null;
    lastname:string | null;
    username:string | null;
    email:string | null;
    password:string | null;
    password_confirmation:string | null;
}

export interface FormLogin{
    email:string | null;
    password:string | null;
}

export type View = 'chatList' | 'newChat' | 'newContact';

export interface User{
    id:number;
    name:string;
    lastname:string;
    username?:string;
    email?:string;
    avatar?:string;
}

export interface Login {
    message:string;
    user:User;
    token:string;
}