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

  //Este metodo es para recuperar las solicitudes de cada usuario que aparece en las solicitudes de la oferta a eliminar
  getSolicitudes(id:string): Observable<OfertaSolicitud[]>{
    return this.db.collection<OfertaSolicitud>(`usuarios/${id}/solicitudes`).valueChanges();
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

  eliminarSolicitud(oferta:OfertaSolicitud,id:string){
    this.db.doc<Oferta>(`usuarios/${id}/solicitudes/${oferta.id}`).delete();
    this.ofertasService.eliminarSolicitudUser(oferta,id);
    console.log("Solicitud ",oferta.id," eliminada en el usuario: ",id);
  }

  editarSolicitud(idOferta:string, id:string, nuevaCategoria:string, nuevoTitulo:string){
    this.db.doc<Oferta>(`usuarios/${id}/solicitudes/${idOferta}`).update({categoria: nuevaCategoria});
    this.db.doc<Oferta>(`usuarios/${id}/solicitudes/${idOferta}`).update({titulo: nuevoTitulo});
    console.log("Solicitud ",idOferta," editada en el usuario: ",id);
  }
  //Método que recibe la cadena id del usuario y devuelve una promesa
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
    this.db.doc<Oferta>(`usuarios/${id}/ofertas/${oferta.id}`).set(oferta);
    console.log("Oferta registrada correctamente en el usuario: "+id, oferta.id, oferta.titulo);
  }

  editarOferta(oferta:Oferta, idUsuario:string){
    this.ofertasService.getSolicitudesOferta(oferta.id, oferta.categoria).subscribe(solicitudes => {
      solicitudes.map(solicitud => {
        this.db.doc<OfertaSolicitud>(`usuarios/${solicitud.id}/solicitudes/${oferta.id}`).update({categoria: oferta.categoria});
      })
    })
    this.db.doc<Oferta>(`usuarios/${idUsuario}/ofertas/${oferta.id}`).update(oferta);
    console.log("Oferta editada correctamente en el usuario: "+idUsuario, oferta.id, oferta.titulo);
  }

  eliminarOferta(oferta:Oferta, id:string){
    this.ofertasService.getSolicitudesOferta(oferta.id,oferta.categoria).subscribe(solicitudes => {
      if(solicitudes.length>0){
        solicitudes.map(solicitud => {
          this.db.doc(`usuarios/${solicitud.id}`).collection('solicitudes').doc(oferta.id).delete();
        })
      }
    })
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

  modificarDatos(datos: {}, idUsuario:string){
    this.usuarioCollection.doc(idUsuario).update(datos).then(() => {console.log(datos), window.location.reload()});
    
  }
  
  async getImage(idUsuario:string){
    const imagePath = `users_images/${idUsuario}/${idUsuario}_profile`;
    const ref = this.storage.ref(imagePath);
    return ref.getDownloadURL()
  }

  actualizarImageTrue(id:string){
    this.usuarioCollection.doc(id).update({image: true}).then(() => console.log("Image: True")).catch(err => console.log(err));    
  }

  actualizarCVTrue(id:string){
    this.usuarioCollection.doc(id).update({cv: true}).then(() => console.log("Cv: True")).catch(err => console.log(err));    
  }
  actualizarCVFalse(id:string){
    this.usuarioCollection.doc(id).update({cv: false}).then(() => console.log("Cv: False")).catch(err => console.log(err));    
  }
}
