import { Oferta } from './oferta';
import { Timestamp } from "@firebase/firestore";
import { AngularFireStorageReference } from '@angular/fire/compat/storage';

export interface Usuario {
    id?:string;
    usuario?:string;
    email?:string;
    image?:string;
    cv?:boolean;
    pais?:string;
    fechaRegistro?:Timestamp;
    ultimaSesion?:Timestamp;
}
