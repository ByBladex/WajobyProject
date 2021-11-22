import { OfertaSolicitud } from './../../models/ofertaSolicitud';
import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-solicitudes-perfil',
  templateUrl: './lista-solicitudes-perfil.component.html',
  styleUrls: ['./lista-solicitudes-perfil.component.css']
})
export class ListaSolicitudesPerfilComponent implements OnInit {

  solicitudes: OfertaSolicitud[]=[];

  constructor(private loginService: LoginService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe(auth => {
      if(auth){
        this.usuarioService.getSolicitudes(auth.uid).subscribe(array => {
          this.solicitudes = array;
        });
      }
    })
  }

}
