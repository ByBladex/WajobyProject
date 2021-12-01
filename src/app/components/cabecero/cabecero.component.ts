import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css']
})
export class CabeceroComponent implements OnInit {

  isLoggedIn: boolean; //si el usuario está logeado o no
  userId: string; //id del usuario autenticado
  image: Observable<string>;
  

  constructor(private loginService: LoginService, private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.isLoggedIn = true;
        this.userId = auth.uid;
        this.usuarioService.getUsuario(this.userId).subscribe(user => {
          if(user.image){
            this.usuarioService.getImage(user.id).then(image => {
              this.image = image;
            })
          }
          else{
            this.image = of('https://firebasestorage.googleapis.com/v0/b/wajoby-8fbf2.appspot.com/o/assets%2Favatar_default.png?alt=media&token=0601b1da-cca2-4663-a4b1-0fb8a731c848')
          }
        })
      }
      else{
        this.isLoggedIn = false;
      }
    })
  }

  logout(){
    this.loginService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
    window.location.reload();
  }
}
