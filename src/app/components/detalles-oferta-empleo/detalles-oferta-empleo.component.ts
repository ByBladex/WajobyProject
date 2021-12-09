import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { OfertaSolicitud } from './../../models/ofertaSolicitud';
import { Timestamp } from '@firebase/firestore';
import { UsuarioSolicitud } from './../../models/usuarioSolicitud';
import { Usuario } from './../../models/usuario';
import { Router } from '@angular/router';
import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { OfertasService } from './../../services/ofertas.service';
import { Oferta } from './../../models/oferta';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentData } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-detalles-oferta-empleo',
  templateUrl: './detalles-oferta-empleo.component.html',
  styleUrls: ['./detalles-oferta-empleo.component.css']
})
export class DetallesOfertaEmpleoComponent implements OnInit {

  categoria:string;
  id:string;
  ofertaSeleccionada:Oferta={};
  usuario:Usuario = {};
  usuarioSolicitud:UsuarioSolicitud = {};
  ofertaSolicitud:OfertaSolicitud = {};
  vistaPrevia:boolean = false;
  solicitudesOferta:DocumentData[] = [];
  listadoUsuariosSolicitudes:Usuario[] = [];
  ocultado:boolean = true;
  solicitada: boolean = false;
  usuarioOfertante:Usuario = {};
  imageUsuarioOfertante:Observable<string>;
  imagenOferta:Observable<string>;

  constructor(private router: Router,private route: ActivatedRoute, private ofertasService: OfertasService, 
    private loginService: LoginService, private usuarioService: UsuarioService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.listadoUsuariosSolicitudes = [];
    this.categoria = this.route.snapshot.params['categoria'];
    this.id = this.route.snapshot.params['id'];
    this.ofertasService.getOferta(this.categoria,this.id).subscribe(oferta => {
      if(oferta){
        this.ofertaSeleccionada = oferta;
        this.ofertaSolicitud.id = oferta.id;
        this.ofertaSolicitud.categoria = oferta.categoria;
        if(this.ofertaSeleccionada.imagen){
          this.ofertasService.getImage(oferta.id).then(image => {
            if(image){
              image.subscribe(img => {
                this.imagenOferta = img;
              })
            }
          }) 
        }

        console.log(this.ofertaSeleccionada)
        this.ofertasService.getSolicitudesOferta(this.ofertaSeleccionada.id, this.ofertaSeleccionada.categoria).subscribe(solicitudes => {
          this.solicitudesOferta = solicitudes;
          this.solicitudesOferta.map(solicitudUsuario =>{
            this.usuarioService.getUsuario(solicitudUsuario.id).subscribe(user => {
              this.listadoUsuariosSolicitudes.push(user)
            })
          })
        });
        this.usuarioService.getUsuario(this.ofertaSeleccionada.usuarioOfertante).subscribe(user => {
          if(user){
            this.usuarioOfertante = user;
            this.usuarioService.getImage(this.usuarioOfertante.id).then(image => {
              this.imageUsuarioOfertante = image;
            })
          }
        })
      }
    })
    this.loginService.getAuth().subscribe(auth => {
      if(auth){
        this.usuarioService.getUsuario(auth.uid).subscribe(user => {
          this.usuario = user;
          this.usuarioSolicitud.id = this.usuario.id;
          this.usuarioService.getSolicitudes(user.id).subscribe(solicitudes => {
            solicitudes.map(solicitud => {
              if(solicitud.id === this.ofertaSolicitud.id)
                this.solicitada = true;
            })
          })
        })
      }
    })
  }

  eliminarOferta(oferta:Oferta){
    this.loginService.getAuth().subscribe(auth => {
      if(auth){
        this.ofertasService.eliminarOferta(oferta);
        this.usuarioService.eliminarOferta(oferta, auth.uid);
        if(oferta.imagen){
          const filePath = `jobs_images/${oferta.id}/${oferta.id}_job`;
          this.storage.ref(filePath).delete();
        }
        this.router.navigate(['/ofertas/'+this.ofertaSeleccionada.categoria]);
      }
    })
  }

  modoVistaPrevia(){
    this.vistaPrevia = true;
  }

  salirVistaPrevia(){
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        console.log(currentUrl);
    });  
  }

  solicitarEmpleo(){
     //al solicitar empleo quiero que muestre una toast. Tambien la quiero para editar y eliminar ofertas
    if(this.usuario.id != null){
      if(this.usuario.cv){
        this.usuarioSolicitud.fechaSolicitud = Timestamp.now();
        this.ofertaSolicitud.fechaSolicitud = Timestamp.now();
        this.ofertasService.registrarSolicitud(this.ofertaSeleccionada,this.usuarioSolicitud);
        this.usuarioService.solicitarOferta(this.ofertaSolicitud, this.usuario.id);
      }
      else
        console.log('Para solicitar empleo debes subir antes tu cv a tu perfil');
    }
    else{
      console.log('Necesitas iniciar sesión');
    }
  }

  eliminarSolicitud(oferta:OfertaSolicitud){
    if(this.usuario.id != null){
      this.usuarioService.eliminarSolicitud(oferta, this.usuario.id);
      this.solicitada = false;
    }
  }

  mostrarOcultar(){
    this.ocultado = !this.ocultado;
  }
}
