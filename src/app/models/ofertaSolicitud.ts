import { Timestamp } from '@firebase/firestore';

export interface OfertaSolicitud {
    id?:string;
    fechaSolicitud?:Timestamp;
    categoria?:string;
    titulo?:string;
}
