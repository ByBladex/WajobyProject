import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
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
export class ModalEditarOfertaComponent implements OnInit{
  oferta: Oferta={
    id:'',
    usuarioOfertante:'',
    categoria:'',
    titulo:'',
    descripcion:'',
    salario:'',
    pais:'',
    provincia:'',
    localidad:'',
  };

  @ViewChild("ofertaForm") ofertaForm:NgForm;
  @ViewChild("botonCerrar") botonCerrar:ElementRef;
  @Input('oferta') ofertaSeleccionada:Oferta;
  @Input('imagen') siImagen:Boolean;

  categoriaOfertaAntigua: string;
  uploadPercent: Observable<number>;
  imagenOferta:File;
  imagen:Observable<string>;

  categorias= []=['infantil','mecanica','construccion','hosteleria','educacion','informatica','comercio','transporte','cuidados'];

  constructor(private ofertasService: OfertasService, private flashMessages: FlashMessagesService, private usuarioService: UsuarioService, 
    private loginService: LoginService, private router: Router, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.oferta = this.ofertaSeleccionada;
    this.categoriaOfertaAntigua=this.ofertaSeleccionada.categoria;
    if(this.ofertaSeleccionada.imagen){
      this.ofertasService.getImage(this.oferta.id).then(async image => {
        if(image){
          image.subscribe(async img => {
            this.imagen = await img;
          })
        }
      }) 
    }
  }

  editarOferta({value,valid}: {value: Oferta, valid: boolean}){
    if(!valid){
      this.flashMessages.show('Por favor, rellene todos los datos obligatorios', {
        cssClass:'alert-danger',timeout:4000
      });
    }
    else{
      //Editar la nueva oferta de empleo
      this.loginService.getAuth().subscribe(auth => {
        if(auth){
          value.usuarioOfertante = auth.uid;
          value.id = this.ofertaSeleccionada.id;
          this.cargarImagenJob(value);
          console.log(value.titulo)
          this.ofertasService.editarOferta(value,this.categoriaOfertaAntigua);
          this.usuarioService.editarOferta(value,auth.uid);
          this.ofertasService.getSolicitudesOferta(this.ofertaSeleccionada.id, this.ofertaSeleccionada.categoria).subscribe(solicitudes => {
            solicitudes.map(solicitudUsuario =>{
              this.usuarioService.editarSolicitud(value.id,solicitudUsuario.id,value.categoria, value.titulo);
            })
          }).remove;
          this.cerrarModal();
          this.router.navigate(['/ofertas/'+value.categoria+"/"+value.id]);
          this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
            this.router.navigate(['/ofertas/'+value.categoria+"/"+value.id]);
          });  
        }
      })
    }
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
    if(this.siImagen){
      oferta.imagen = true;
      this.subirImagen(oferta);
    }
    else{
      oferta.imagen = false;
      this.subirImagen(oferta);
    }
  }

  subirImagen(oferta:Oferta){
    if(this.imagenOferta && (this.imagenOferta.type === 'image/jpeg' || 'image/jpg' || 'image/png') && this.imagenOferta.size <= 2097152){ //si el archivo existe, el tipo es jpg,png o jpeg y su tamaño es <= 2mb
      if(this.siImagen)
        this.eliminarImagen(oferta);
      const filePath = `jobs_images/${oferta.id}/${oferta.id}_job`;
      const task = this.storage.upload(filePath,this.imagenOferta);
      this.uploadPercent = task.percentageChanges();
      console.log('imagen subida');
      oferta.imagen = true;
    }
  }
  eliminarImagen(oferta:Oferta){
    const deletePath = `jobs_images/${oferta.id}/${oferta.id}_job`;
    this.storage.ref(deletePath).delete();
    console.log('imagen eliminada')
  }

  private cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }
}
