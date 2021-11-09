import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from './../../services/login.service';
import { UsuarioService } from './../../services/usuario.service';
import { OfertasService } from './../../services/ofertas.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Oferta } from './../../models/oferta';
import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-editar-oferta',
  templateUrl: './modal-editar-oferta.component.html',
  styleUrls: ['./modal-editar-oferta.component.css']
})
export class ModalEditarOfertaComponent implements OnInit {
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

  categorias= []=['infantil','fitness','mecanica','construccion','hosteleria','educacion','informatica','comercio','transporte','cuidados'];

  constructor(private ofertasService: OfertasService, private flashMessages: FlashMessagesService, private usuarioService: UsuarioService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.oferta = this.ofertaSeleccionada;
    this.idOfertaAntigua=this.ofertaSeleccionada.id;
    this.categoriaOfertaAntigua=this.ofertaSeleccionada.categoria;
  }

  editarOferta({value,valid}: {value: Oferta, valid: boolean}){
    if(!valid){
      this.flashMessages.show('Por favor, rellene el formulario correctamente', {
        cssClass:'alert-danger',timeout:4000
      });
    }
    else{
      //Editar la nueva oferta de empleo
      this.loginService.getAuth().subscribe(auth => {
        if(auth){
          value.usuarioOfertante = auth.uid;
          value.id=this.ofertasService.genId(value);
          this.ofertasService.editarOferta(value, this.idOfertaAntigua ,this.categoriaOfertaAntigua);
          this.usuarioService.editarOferta(value,this.idOfertaAntigua,auth.uid);
          this.cerrarModal();
          this.router.navigate(['/ofertas/'+this.oferta.categoria+"/"+this.ofertasService.genId(this.oferta)]);
        }
      })
    }
  }

  private cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }
}
