import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { Usuario } from '../../models/usuario';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario={};

  loginForm: FormGroup;
  constructor(private router: Router, private flashMessages: FlashMessagesService, private loginService: LoginService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.router.navigate(['/']);
      }
    })
    this.loginForm = new FormGroup({
      username: new FormControl ('', Validators.required),
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', [Validators.required, Validators.minLength(6)])
    });
  }
  
  login(){
    if(this.loginForm.controls.email.invalid || this.loginForm.controls.password.invalid){
      this.flashMessages.show('Debes rellenar todos los campos para iniciar sesion', {
        cssClass: 'alert-danger', timeout: 4000
      });
    }
    else{
      this.loginService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value).then(res => {
        this.loginService.getAuth().subscribe(auth => {
          if(auth && auth.emailVerified){
            this.router.navigate(['/']);
            this.usuarioService.actualizarUltimaSesion(auth.uid);
          }
          else if(auth){
            this.usuarioService.actualizarUltimaSesion(auth.uid);
          }
        }).remove;
      }).catch(err => {
        this.flashMessages.show(err.message, {
          cssClass: 'alert-danger', timeout:4000 
        })
      });
    }
  }

}
