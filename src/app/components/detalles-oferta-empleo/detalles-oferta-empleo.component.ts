import { OfertaSolicitud } from './../../models/ofertaSolicitud';
import { Timestamp } from '@firebase/firestore';
import { UsuarioSolicitud } from './../../models/usuarioSolicitud';
import { Usuario } from './../../models/usuario';
import { Router } from '@angular/router';
import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { OfertasService } from './../../services/ofertas.service';
import { Oferta } from './../../models/oferta';
import { Component, OnInit } from '@angular/core';
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
  usuario:Usuario={};
  usuarioSolicitud: UsuarioSolicitud={};
  ofertaSolicitud: OfertaSolicitud = {};
  vistaPrevia:boolean=false;
  solicitudesOferta:DocumentData[];
  listadoUsuariosSolicitudes:Usuario[]=[];
  ocultado:boolean=true;

  constructor(private router: Router,private route: ActivatedRoute, private ofertasService: OfertasService, private loginService: LoginService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.categoria = this.route.snapshot.params['categoria'];
    this.id = this.route.snapshot.params['id'];
    this.ofertasService.getOferta(this.categoria,this.id).subscribe(oferta => {
      if(oferta)
        this.ofertaSeleccionada = oferta;
        this.ofertaSolicitud.id =  oferta.id;
        this.ofertasService.getSolicitudesOferta(this.ofertaSeleccionada).subscribe(solicitudes => {
          this.solicitudesOferta = solicitudes;
          this.solicitudesOferta.map(solicitudUsuario =>{
            this.usuarioService.getUsuario(solicitudUsuario.id).subscribe(user => {
              this.listadoUsuariosSolicitudes.push(user)
            })
          })
        });
        this.loginService.getAuth().subscribe(auth => {
          if(auth){
            this.usuarioService.getUsuario(auth.uid).subscribe(user => {
              this.usuario = user;
              this.usuarioSolicitud.id = this.usuario.id;
            })
          }
        })
    })
  }

  eliminarOferta(oferta:Oferta){
    this.loginService.getAuth().subscribe(auth => {
      if(auth){
        this.ofertasService.eliminarOferta(oferta);
        this.usuarioService.eliminarOferta(oferta, auth.uid);
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
      this.usuarioSolicitud.fechaSolicitud, this.ofertaSolicitud.fechaSolicitud = Timestamp.now(); //Así ambos tienen la misma fecha y hora
      this.ofertasService.registrarSolicitud(this.ofertaSeleccionada,this.usuarioSolicitud);
      this.usuarioService.solicitarOferta(this.ofertaSolicitud, this.usuario.id);
    }
    else
      console.log('necesitas loguearte para solicitar empleo');
  }

  mostrarOcultar(){
    this.ocultado = !this.ocultado;
  }
}
