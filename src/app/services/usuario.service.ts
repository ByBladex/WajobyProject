import { OfertaSolicitud } from './../models/ofertaSolicitud';
import { OfertasService } from './ofertas.service';
import { Oferta } from './../models/oferta';
import { Timestamp } from '@firebase/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioCollection: AngularFirestoreCollection<Usuario>;
  usuarioDoc: AngularFirestoreDocument<Usuario>;
  usuario: Observable<Usuario>;

  constructor(private db: AngularFirestore, private ofertasService: OfertasService, private storage: AngularFireStorage) {
    this.usuarioCollection = db.collection('usuarios');
  }

  userExist(id:string){
    return (this.db.firestore.doc(`usuarios/${id}`).get())
  }

  getUsuario(id:string){
    this.usuarioDoc = this.db.doc<Usuario>(`usuarios/${id}`);
    this.usuario = this.usuarioDoc.snapshotChanges().pipe(
      map(accion => {
        if(accion.payload.exists === false){
          return null;
        }
        else{
          const datos = accion.payload.data() as Usuario;
          datos.id = accion.payload.id;
          return datos;
        }
      })
    );
    return this.usuario;
  }

  getOfertas(id:string): Observable<Oferta[]> {
    return this.db.collection<Oferta>(`usuarios/${id}/ofertas`).valueChanges();
  
    /* or instead snapshotChanges() with map()
      return this.firestore.collection<Employee>('employees')
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
         });
      )
    */
  }

  solicitarOferta(oferta:OfertaSolicitud,id:string){
    this.db.doc<Oferta>(`usuarios/${id}/solicitudes/${oferta.id}`).set(oferta);
    console.log("Empleo ",oferta.id," guardado en el usuario: ",id);
  }

  async getCV(idUsuario:string){
    const filePath = `users_cv/${idUsuario}/${idUsuario}_cv.pdf`;
    const ref = this.storage.ref(filePath);
    return ref.getDownloadURL()
  }

  registrarUsuarioDB(usuario: Usuario){
    this.usuarioCollection.doc(usuario.id).set(usuario);
    console.log("Usuario registrado: "+usuario.id, usuario.email);
  }

  registrarOferta(oferta:Oferta,id:string){
    this.db.doc<Oferta>(`usuarios/${id}/ofertas/${this.ofertasService.genId(oferta)}`).set(oferta);
    console.log("Oferta registrada correctamente en el usuario: "+id, oferta.id, oferta.titulo);
  }

  editarOferta(oferta:Oferta, idOferta:string, idUsuario:string){
    this.db.doc<Oferta>(`usuarios/${idUsuario}/ofertas/${idOferta}`).delete();
    this.db.doc<Oferta>(`usuarios/${idUsuario}/ofertas/${oferta.id}`).set(oferta);
    console.log("Oferta editada correctamente en el usuario: "+idUsuario, oferta.id, oferta.titulo);
  }

  eliminarOferta(oferta:Oferta, id:string){
    this.db.doc<Oferta>(`usuarios/${id}/ofertas/${oferta.id}`).delete();
    console.log("Oferta eliminada del usuario correctamente: "+oferta.id);
  }

  //metodo para eliminar el cv y habrá un botón para eliminarlo
  eliminarCV(id:string){
    const filePath = `users_cv/${id}/${id}_cv.pdf`;
    const ref = this.storage.ref(filePath);
    ref.delete();
    this.actualizarCVFalse(id);
    console.log("cv del usuario",id," eliminado")
  }

  actualizarUltimaSesion(id: string){
    this.usuarioCollection.doc(id).update({ultimaSesion: Timestamp.now()}).then(() => console.log("Ultima sesion de usuario actualizada")).catch(err => console.log(err));    
  }
  
  actualizarCVTrue(id:string){
    this.usuarioCollection.doc(id).update({cv: true}).then(() => console.log("Cv: True")).catch(err => console.log(err));    
  }
  actualizarCVFalse(id:string){
    this.usuarioCollection.doc(id).update({cv: false}).then(() => console.log("Cv: False")).catch(err => console.log(err));    
  }
}
