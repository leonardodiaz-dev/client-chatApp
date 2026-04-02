
export interface FormUser {
    name:string | null;
    email:string | null;
    password:string | null;
    password_confirmation:string | null;
}

export interface FormLogin{
    email:string | null;
    password:string | null;
}

export type View = 'chatList' | 'newChat' | 'newContact';

export interface Login {
    message:string;
    user:{
        name:string;
        email:string;    
    }
    token:string;
}