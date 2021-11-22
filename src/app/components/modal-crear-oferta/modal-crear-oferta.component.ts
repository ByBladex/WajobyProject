import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { OfertasService } from './../../services/ofertas.service';
import { Oferta } from './../../models/oferta';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal-crear-oferta',
  templateUrl: './modal-crear-oferta.component.html',
  styleUrls: ['./modal-crear-oferta.component.css']
})
export class ModalCrearOfertaComponent implements OnInit {

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

  categorias= []=['infantil','fitness','mecanica','construccion','hosteleria','educacion','informatica','comercio','transporte','cuidados'];
  

  constructor(private ofertasService: OfertasService, private flashMessages: FlashMessagesService, private loginService: LoginService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }
 //Tengo que controlar que si ya existe una oferta de ese usuario con el mismo titulo no permita crearla
  agregarOferta({value,valid}: {value: Oferta, valid: boolean}){
    if(!valid){
      this.flashMessages.show('Por favor, rellene el formulario correctamente', {
        cssClass:'alert-danger',timeout:4000
      });
    }
    else{
      //Agregar la nueva oferta de empleo
      this.loginService.getAuth().subscribe(auth => {
        if(auth){
          value.usuarioOfertante = auth.uid;
          value.id=this.ofertasService.genId();
          this.ofertasService.registrarOferta(value);
          this.usuarioService.registrarOferta(value,auth.uid);
          this.ofertaForm.resetForm();
          this.cerrarModal();
        }
      })
    }
  }

  private cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }

}
