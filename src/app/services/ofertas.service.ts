import { UsuarioSolicitud } from './../models/usuarioSolicitud';
import { Usuario } from './../models/usuario';
import { Oferta } from './../models/oferta';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

    ofertasCollection: AngularFirestoreCollection<Oferta>;
    ofertasDoc: AngularFirestoreDocument<Oferta>;
    oferta: Observable<Oferta>;

    constructor(private db: AngularFirestore) {
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

    //convierte el titulo de la oferta, pasa los espacios en blanco a guiones '-' y le añade la id del usuarioOfertante
    genId(value:Oferta){
      var id = value.titulo.replace(/\s/g,'-')
      return  id+'-'+value.usuarioOfertante
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

    registrarSolicitud(oferta:Oferta, usuario:UsuarioSolicitud){
      this.db.doc(`empleos/${oferta.categoria}/ofertas/${oferta.id}/solicitudes/${usuario.id}`).set(usuario);
      console.log("Empleo ",oferta.titulo," solicitado por el usuario: ",usuario.id);
    }

    getSolicitudesOferta(ofertaId:string, categoria:string){
      return this.db.doc(`empleos/${categoria}/ofertas/${ofertaId}`).collection('solicitudes').valueChanges();
    }

    registrarOferta(oferta:Oferta){
      this.db.doc<Oferta>(`empleos/${oferta.categoria}/ofertas/${this.genId(oferta)}`).set(oferta);
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
      this.db.doc<Oferta>(`empleos/${oferta.categoria}/ofertas/${oferta.id}`).delete();
      console.log("Oferta eliminada correctamente: "+oferta.id);
    }
}
