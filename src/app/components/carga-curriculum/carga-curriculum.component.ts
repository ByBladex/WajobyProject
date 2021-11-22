import { FlashMessagesService } from 'angular2-flash-messages';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoginService } from './../../services/login.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-carga-curriculum',
  templateUrl: './carga-curriculum.component.html',
  styleUrls: ['./carga-curriculum.component.css']
})
export class CargaCurriculumComponent implements OnInit {

  file: File;
  uploadPercent: Observable<number>;
  urlCv: Observable<string>;

  @Input('usuarioActivo') usuario: Usuario;

  constructor(private usuarioService: UsuarioService, private loginService: LoginService, private storage: AngularFireStorage, private flashMessages:FlashMessagesService) { }

  ngOnInit(): void {
    if(this.usuario.cv == false)
      this.urlCv = null;
    else
      this.getCV()
  }

  getCV(){
    this.usuarioService.getCV(this.usuario.id).then(url => {
      this.urlCv = url;
    })
  }

  cvSeleccionado(event:any){
    if(event.target.files.length > 0 && event.target.files[0].type == 'application/pdf'){
      this.file = event.target.files[0];
      console.log(this.file.size)
    }
    else{
      this.file = null;
      this.flashMessages.show('El archivo introduccido no es válido', {
        cssClass: 'alert-danger', timeout: 4000
      });
    }
  }

  cargarCV(){
      if(this.file && this.file.type == 'application/pdf' && this.file.size <= 2097152){ //si el archivo existe, el tipo es pdf y su tamaño es <= 2mb
        const filePath = `users_cv/${this.usuario.id}/${this.usuario.id}_cv.pdf`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath,this.file);
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(finalize(() => this.urlCv = ref.getDownloadURL())).subscribe();
        this.usuarioService.actualizarCVTrue(this.usuario.id);
      }
      else
        console.log("archivo nulo");
  }
  
  eliminarCV(){
    this.usuarioService.eliminarCV(this.usuario.id);
    this.urlCv = null;
  }
}
