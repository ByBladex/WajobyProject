import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { OfertasService } from './../../services/ofertas.service';
import { Oferta } from './../../models/oferta';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { finalize } from 'rxjs/operators';

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
    imagen:false,
    salario:null,
    pais:'',
    provincia:'',
    localidad:'',
  };
  imagenOferta:File;
  usuario: Usuario;
  uploadPercent: Observable<number>;

  @ViewChild("ofertaForm") ofertaForm:NgForm;
  @ViewChild("botonCerrar") botonCerrar:ElementRef;

  categorias=['infantil','fitness','mecanica','construccion','hosteleria','educacion','informatica','comercio','transporte','cuidados'];
  

  constructor(private ofertasService: OfertasService, private flashMessages: FlashMessagesService, 
    private loginService: LoginService, private usuarioService: UsuarioService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe(auth => {
      if(auth){
        this.usuarioService.getUsuario(auth.uid).subscribe(user => {
          this.usuario = user;
        })
      }
    });
  }

  agregarOferta({value,valid}: {value: Oferta, valid: boolean}){
    if(!valid){
      this.flashMessages.show('Por favor, rellene todos los datos obligatorios', {
        cssClass:'alert-danger',timeout:4000
      });
    }
    else{
      //Agregar la nueva oferta de empleo
      value.usuarioOfertante = this.usuario.id;
      value.id=this.ofertasService.genId();
      value.imagen=false;
      console.log(value);
      this.cargarImagenJob(value);
      this.ofertasService.registrarOferta(value);
      this.usuarioService.registrarOferta(value,this.usuario.id);
      this.ofertaForm.resetForm();
      this.cerrarModal();
    }
  }

  private cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }

  imagenSeleccionada(event:any){
    console.log(event.target.files[0].type)
    if(event.target.files.length > 0 && (event.target.files[0].type === 'image/jpeg' || 'image/jpg' || 'image/png')){
      this.imagenOferta = event.target.files[0];
      console.log(this.imagenOferta.size)
    }
    else{
      this.imagenOferta = null;
      this.flashMessages.show('El archivo introduccido no es válido', {
        cssClass: 'alert-danger', timeout: 4000
      });
    }
  }

  cargarImagenJob(oferta:Oferta){
    if(this.imagenOferta && (this.imagenOferta.type === 'image/jpeg' || 'image/jpg' || 'image/png') && this.imagenOferta.size <= 2097152){ //si el archivo existe, el tipo es jpg,png o jpeg y su tamaño es <= 2mb
      const filePath = `jobs_images/${oferta.id}/${oferta.id}_job`;
      const task = this.storage.upload(filePath,this.imagenOferta);
      this.uploadPercent = task.percentageChanges();
      oferta.imagen = true;
      console.log('imagen subida');
    }
  }
}
