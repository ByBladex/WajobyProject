import { Usuario } from './../../models/usuario';
import { LoginService } from './../../services/login.service';
import { UsuarioService } from './../../services/usuario.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuarioActivo: Usuario;
  verificado:boolean;

  constructor(private usuarioService: UsuarioService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.verificado = auth.emailVerified;
        this.usuarioService.getUsuario(auth.uid).subscribe( usuario => {
          this.usuarioActivo = usuario;
        });
      }
    }).remove
  }

  guardarValores(){
    
  }

}
