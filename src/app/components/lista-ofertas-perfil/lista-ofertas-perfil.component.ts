import { Oferta } from './../../models/oferta';
import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { OfertasService } from './../../services/ofertas.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-ofertas-perfil',
  templateUrl: './lista-ofertas-perfil.component.html',
  styleUrls: ['./lista-ofertas-perfil.component.css']
})
export class ListaOfertasPerfilComponent implements OnInit {

  ofertas: Oferta[]=[];

  constructor(private loginService: LoginService, private usuarioService: UsuarioService) { }
  
  ngOnInit(): void {
    this.loginService.getAuth().subscribe(auth => {
      if(auth){
        this.usuarioService.getOfertas(auth.uid).subscribe(array => {
          this.ofertas = array;
        });
      }
    })
  }

}
