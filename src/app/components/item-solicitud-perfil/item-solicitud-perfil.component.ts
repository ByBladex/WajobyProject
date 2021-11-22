import { LoginService } from './../../services/login.service';
import { OfertaSolicitud } from './../../models/ofertaSolicitud';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-solicitud-perfil',
  templateUrl: './item-solicitud-perfil.component.html',
  styleUrls: ['./item-solicitud-perfil.component.css']
})
export class ItemSolicitudPerfilComponent implements OnInit {

  solicitud: OfertaSolicitud;

  @Input('solicitud') solicitudSeleccionada:OfertaSolicitud;

  constructor(private usuarioService: UsuarioService, private loginService:LoginService) { }

  ngOnInit(): void {
    this.solicitud = this.solicitudSeleccionada;
  }

  eliminarSolicitud(solicitud: OfertaSolicitud){
    this.loginService.getAuth().subscribe(auth => {
      if(auth){
        this.usuarioService.eliminarSolicitud(solicitud, auth.uid);
      }
    })
  }
}
