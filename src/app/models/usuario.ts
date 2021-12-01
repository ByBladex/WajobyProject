import { Timestamp } from "@firebase/firestore";

export interface Usuario {
    id?:string;
    nombre?:string;
    apellidos?:string;
    email?:string;
    telefono?:string;
    image?:boolean;
    cv?:boolean;
    pais?:string;
    fechaRegistro?:Timestamp;
    ultimaSesion?:Timestamp;
}
