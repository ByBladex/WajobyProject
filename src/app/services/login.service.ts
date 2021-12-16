import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public authService: AngularFireAuth) { }
  
  //Método asincrono que recibe el email y devuelve una promesa
  async resetPassword(email:string){
    return new Promise((resolve, reject) => {
      this.authService.sendPasswordResetEmail(email).then(datos => resolve(datos), error => reject(error));
    })
  }
  //Método asincrono que recibe el email y la contraseña y devuelve una promesa
  async login(email:string, pass:string){
    return new Promise((resolve, reject) => {
      this.authService.signInWithEmailAndPassword(email,pass).then(datos => resolve(datos), error => reject(error));
    })
  }
  //Método asincrono que recibe el email y la contraseña y devuelve una promesa
  async registrarse(email:string, password:string){
    return new Promise((resolve, reject) => {
      this.authService.createUserWithEmailAndPassword(email,password).then(datos => resolve(datos), error => reject(error));
    })      
  }

  getAuth(){
    return this.authService.authState.pipe(
      map( auth => auth)
    );
  }

  logout(){
    this.authService.signOut();
  }
}
