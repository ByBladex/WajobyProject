import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LoginService } from './../../services/login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.component.html',
  styleUrls: ['./recuperar-pass.component.css']
})
export class RecuperarPassComponent implements OnInit {
  
  formEmail: FormGroup;

  constructor(private loginService: LoginService, private router: Router, private flashMessages: FlashMessagesService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.router.navigate(['/']);
      }
    })
    this.formEmail = new FormGroup({
      email: new FormControl ('', [Validators.required, Validators.email])
    });
  }

  async resetPassword(){
    const email = this.formEmail.controls.email.value;
    this.loginService.resetPassword(email).then(res => {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 4000);  //4s
      this.flashMessages.show('Email de recuperación de contraseña enviado. Redirigiendo a Login...', {
        cssClass: 'alert-success', timeout:4000
      })
    }).catch(err => {
      this.flashMessages.show('No se encontró el email proporcionado', {
        cssClass: 'alert-danger', timeout:4000 
      })
    })
  }

}
