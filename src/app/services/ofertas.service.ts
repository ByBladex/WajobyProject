import { AngularFireStorage } from '@angular/fire/compat/storage';
import { OfertaSolicitud } from './../models/ofertaSolicitud';
import { UsuarioSolicitud } from './../models/usuarioSolicitud';
import { Oferta } from './../models/oferta';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class OfertasService {
    ofertasCollection: AngularFirestoreCollection<Oferta>;
    ofertasDoc: AngularFirestoreDocument<Oferta>;
    oferta: Observable<Oferta>;

    constructor(private db: AngularFirestore, private storage: AngularFireStorage) {
        this.ofertasCollection = this.db.collection('empleos');
    }
    
    getOferta(categoria:string, id:string){
        this.ofertasDoc = this.db.doc<Oferta>(`empleos/${categoria}/ofertas/${id}`);
        this.oferta = this.ofertasDoc.snapshotChanges().pipe(
          map(accion => {
            if(accion.payload.exists === false){
              return null;
            }
            else{
              const datos = accion.payload.data() as Oferta;
              datos.id = accion.payload.id;
              return datos;
            }
          })
        );
        return this.oferta;
    }

    generarID(){
      let myId = uuidv4();
      console.log(myId);
    }

    //convierte el titulo de la oferta, pasa los espacios en blanco a guiones '-' y le añade la id del usuarioOfertante
    genId(){
      let id = uuidv4();
      return id;
    }

    getOfertas(categoria:string): Observable<Oferta[]> {
        return this.db.collection<Oferta>(`empleos/${categoria}/ofertas`).valueChanges();
      
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

    async getImage(idOferta:string){
      const imagePath = `jobs_images/${idOferta}/${idOferta}_job`;
      const ref = this.storage.ref(imagePath);
      return ref.getDownloadURL();
    }

    actualizarImageTrue(id:string){
      this.ofertasCollection.doc(id).update({imagen: true}).then(() => console.log("Imagen: True")).catch(err => console.log(err));    
    }

    registrarSolicitud(oferta:Oferta, usuario:UsuarioSolicitud){
      this.db.doc(`empleos/${oferta.categoria}/ofertas/${oferta.id}/solicitudes/${usuario.id}`).set(usuario);
      console.log("Empleo ",oferta.titulo," solicitado por el usuario: ",usuario.id);
    }

    eliminarSolicitudUser(oferta:OfertaSolicitud,idUsuario:string){
      this.db.doc(`empleos/${oferta.categoria}/ofertas/${oferta.id}`).collection('solicitudes').doc(idUsuario).delete();
      console.log("Solicitud de la oferta ",oferta.id," eliminada por el usuario: ",idUsuario);
    }

    getSolicitudesOferta(ofertaId:string, categoria:string){
      return this.db.doc(`empleos/${categoria}/ofertas/${ofertaId}`).collection('solicitudes').valueChanges();
    }

    registrarOferta(oferta:Oferta){
      this.db.doc<Oferta>(`empleos/${oferta.categoria}/ofertas/${oferta.id}`).set(oferta);
      console.log("Oferta registrada correctamente: "+oferta.id, oferta.titulo);
    }

    editarOferta(oferta:Oferta, categoriaOfertaAntigua:string){
      this.db.doc<Oferta>(`empleos/${categoriaOfertaAntigua}/ofertas/${oferta.id}`).delete();
      this.db.doc<Oferta>(`empleos/${oferta.categoria}/ofertas/${oferta.id}`).set(oferta);
      if(categoriaOfertaAntigua != oferta.categoria){
        this.getSolicitudesOferta(oferta.id,categoriaOfertaAntigua).subscribe(solicitudes => {
          if(solicitudes.length>0){
            solicitudes.map(solicitud => {
              this.db.doc(`empleos/${oferta.categoria}/ofertas/${oferta.id}`).collection('solicitudes').doc(solicitud.id).set(solicitud);
              this.db.doc(`empleos/${categoriaOfertaAntigua}/ofertas/${oferta.id}`).collection('solicitudes').doc(solicitud.id).delete();
            })
          }
        })
      }
      console.log("Oferta editada correctamente: "+oferta.id, oferta.titulo);
    }

    eliminarOferta(oferta:Oferta){
      this.getSolicitudesOferta(oferta.id,oferta.categoria).subscribe(solicitudes => {
        if(solicitudes.length>0){
          solicitudes.map(solicitud => {
            this.db.doc(`empleos/${oferta.categoria}/ofertas/${oferta.id}`).collection('solicitudes').doc(solicitud.id).delete();
          })
        }
      })
      this.db.doc<Oferta>(`empleos/${oferta.categoria}/ofertas/${oferta.id}`).delete();
      console.log("Oferta eliminada correctamente: "+oferta.id);
    }
}
