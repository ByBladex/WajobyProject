import { FlashMessagesService } from 'angular2-flash-messages';
import { LoginService } from './../../services/login.service';
import { UsuarioService } from './../../services/usuario.service';
import { OfertasService } from './../../services/ofertas.service';
import { Oferta } from './../../models/oferta';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-item-oferta-perfil',
  templateUrl: './item-oferta-perfil.component.html',
  styleUrls: ['./item-oferta-perfil.component.css']
})
export class ItemOfertaPerfilComponent implements OnInit {
  
  oferta: Oferta={
    id:'',
    usuarioOfertante:'',
    categoria:'',
    titulo:'',
    descripcion:'',
    diasLaborales:{},
    imagen:'',
    salario:'',
    pais:'',
    provincia:'',
    municipio:'',
  };
  
  @ViewChild("ofertaForm") ofertaForm:NgForm;
  @ViewChild("botonCerrar") botonCerrar:ElementRef;
  @Input('oferta') ofertaSeleccionada:Oferta;

  idOfertaAntigua: string;
  categoriaOfertaAntigua: string;

  constructor(private ofertasService: OfertasService, private usuarioService: UsuarioService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.oferta = this.ofertaSeleccionada;
  }

  eliminarOferta(oferta:Oferta){
    this.loginService.getAuth().subscribe(auth => {
      if(auth){
        this.ofertasService.eliminarOferta(oferta);
        this.usuarioService.eliminarOferta(oferta, auth.uid);
      }
    })
  }
}
