import { Timestamp } from '@firebase/firestore';

export interface UsuarioSolicitud {
    id?:string;
    fechaSolicitud?:Timestamp;
}
