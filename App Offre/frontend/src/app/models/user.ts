export interface User {
    id: number;
    email: string;
    name:string;
    password: string;
    token: string  | null;
    matriculeFiscale:string;
    role:string;
    active:boolean

    }
