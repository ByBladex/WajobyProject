import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Pais } from './../../models/pais.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Usuario } from './../../models/usuario';
import { LoginService } from './../../services/login.service';
import { UsuarioService } from './../../services/usuario.service';

import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  uploadPercent: Observable<number>;
  usuarioActivo: Usuario;
  verificado:boolean;
  imagen:File;
  image:Observable<string>;

  datosUsuario: FormGroup;

  paises: Pais[]=[{nombre: "Afghanistan"},{nombre: "Albania"},{nombre: "Algeria"},{nombre: "Andorra"},{nombre: "Angola"},{nombre: "Antigua and Barbuda"},{nombre: "Argentina"},{nombre: "Armenia"},
  {nombre: "Australia"},{nombre: "Austria"},{nombre: "Azerbaijan"},{nombre: "Bahamas"},{nombre: "Bahrain"},{nombre: "Bangladesh"},{nombre: "Barbados"},{nombre: "Belarus"},{nombre: "Belgium"},
  {nombre: "Belize"},{nombre: "Benin"},{nombre: "Bhutan"},{nombre: "Bolivia"},{nombre: "Bosnia and Herzegovina"},{nombre: "Botswana"},{nombre: "Brazil"},{nombre: "Brunei"},{nombre: "Bulgaria"},
  {nombre: "Burkina Faso"},{nombre: "Burundi"},{nombre: "Cambodia"},{nombre: "Cameroon"},{nombre: "Canada"},{nombre: "Cape Verde"},{nombre: "Central African Republic"},{nombre: "Chad"},{nombre: "Chile"},
  {nombre: "China"},{nombre: "Colombia"},{nombre: "Comoros"},{nombre: "Congo (Brazzaville)"},{nombre: "Congo"},{nombre: "Costa Rica"},{nombre: "Cote d'Ivoire"},{nombre: "Croatia"},{nombre: "Cuba"},
  {nombre: "Cyprus"},{nombre: "Czech Republic"},{nombre: "Denmark"},{nombre: "Djibouti"},{nombre: "Dominica"},{nombre: "Dominican Republic"},{nombre: "East Timor (Timor Timur)"},{nombre: "Ecuador"},
  {nombre: "Egypt"},{nombre: "El Salvador"},{nombre: "Equatorial Guinea"},{nombre: "Eritrea"},{nombre: "Estonia"},{nombre: "Ethiopia"},{nombre: "Fiji"},{nombre: "Finland"},{nombre: "France"},
  {nombre: "Gabon"},{nombre: "Gambia"},{nombre: "Georgia"},{nombre: "Germany"},{nombre: "Ghana"},{nombre: "Greece"},{nombre: "Grenada"},{nombre: "Guatemala"},{nombre: "Guinea"},{nombre: "Guinea-Bissau"},
  {nombre: "Guyana"},{nombre: "Haiti"},{nombre: "Honduras"},{nombre: "Hungary"},{nombre: "Iceland"},{nombre: "India"},{nombre: "Indonesia"},{nombre: "Iran"},{nombre: "Iraq"},{nombre: "Ireland"},
  {nombre: "Israel"},{nombre: "Italy"},{nombre: "Jamaica"},{nombre: "Japan"},{nombre: "Jordan"},{nombre: "Kazakhstan"},{nombre: "Kenya"},{nombre: "Kiribati"},{nombre: "North Korea"},{nombre: "South Korea"},
  {nombre: "Kuwait"},{nombre: "Kyrgyzstan"},{nombre: "Laos"},{nombre: "Latvia"},{nombre: "Lebanon"},{nombre: "Lesotho"},{nombre: "Liberia"},{nombre: "Libya"},{nombre: "Liechtenstein"},{nombre: "Lithuania"},
  {nombre: "Luxembourg"},{nombre: "Macedonia"},{nombre: "Madagascar"},{nombre: "Malawi"},{nombre: "Malaysia"},{nombre: "Maldives"},{nombre: "Mali"},{nombre: "Malta"},{nombre: "Marshall Islands"},
  {nombre: "Mauritania"},{nombre: "Mauritius"},{nombre: "Mexico"},{nombre: "Micronesia"},{nombre: "Moldova"},{nombre: "Monaco"},{nombre: "Mongolia"},{nombre: "Morocco"},{nombre: "Mozambique"},
  {nombre: "Myanmar"},{nombre: "Namibia"},{nombre: "Nauru"},{nombre: "Nepa"},{nombre: "Netherlands"},{nombre: "New Zealand"},{nombre: "Nicaragua"},{nombre: "Niger"},{nombre: "Nigeria"},{nombre: "Norway"},
  {nombre: "Oman"},{nombre: "Pakistan"},{nombre: "Palau"},{nombre: "Panama"},{nombre: "Papua New Guinea"},{nombre: "Paraguay"},{nombre: "Peru"},{nombre: "Philippines"},{nombre: "Poland"},{nombre: "Portugal"},
  {nombre: "Qatar"},{nombre: "Romania"},{nombre: "Russia"},{nombre: "Rwanda"},{nombre: "Saint Kitts and Nevis"},{nombre: "Saint Lucia"},{nombre: "Saint Vincent"},{nombre: "Samoa"},{nombre: "San Marino"},
  {nombre: "Sao Tome and Principe"},{nombre: "Saudi Arabia"},{nombre: "Senegal"},{nombre: "Serbia and Montenegro"},{nombre: "Seychelles"},{nombre: "Sierra Leone"},{nombre: "Singapore"},{nombre: "Slovakia"},
  {nombre: "Slovenia"},{nombre: "Solomon Islands"},{nombre: "Somalia"},{nombre: "South Africa"},{nombre: "Spain"},{nombre: "Sri Lanka"},{nombre: "Sudan"},{nombre: "Suriname"},{nombre: "Swaziland"},
  {nombre: "Sweden"},{nombre: "Switzerland"},{nombre: "Syria"},{nombre: "Taiwan"},{nombre: "Tajikistan"},{nombre: "Tanzania"},{nombre: "Thailand"},{nombre: "Togo"},{nombre: "Tonga"},{nombre: "Trinidad and Tobago"},
  {nombre: "Tunisia"},{nombre: "Turkey"},{nombre: "Turkmenistan"},{nombre: "Tuvalu"},{nombre: "Uganda"},{nombre: "Ukraine"},{nombre: "United Arab Emirates"},{nombre: "United Kingdom"},{nombre: "United States"},
  {nombre: "Uruguay"},{nombre: "Uzbekistan"},{nombre: "Vanuatu"},{nombre: "Vatican City"},{nombre: "Venezuela"},{nombre: "Vietnam"},{nombre: "Yemen"},{nombre: "Zambia"},{nombre: "Zimbabwe"}];

  constructor(private usuarioService: UsuarioService,private storage: AngularFireStorage, private loginService: LoginService, private flashMessages:FlashMessagesService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.verificado = auth.emailVerified;
        this.usuarioService.getUsuario(auth.uid).subscribe( usuario => {
          this.usuarioActivo = usuario;
          if(usuario.image){
            this.usuarioService.getImage(usuario.id).then(image => {
              this.image = image;
            })
          }
          else{
            this.image = of('https://firebasestorage.googleapis.com/v0/b/wajoby-8fbf2.appspot.com/o/assets%2Favatar_default.png?alt=media&token=0601b1da-cca2-4663-a4b1-0fb8a731c848')
          }
        });
      }
    })
    this.datosUsuario = new FormGroup({
      name: new FormControl ({value:'',disabled:true}, Validators.required),
      surnames: new FormControl ({value:'',disabled:true}, Validators.required),
      pais: new FormControl ({value:'',disabled:true}, Validators.required),
      telefono: new FormControl ('', [Validators.required, Validators.minLength(9)]),
    });
  }

  imagenSeleccionada(event:any){
    console.log(event.target.files[0].type)
    if(event.target.files.length > 0 && (event.target.files[0].type === 'image/jpeg' || 'image/jpg' || 'image/png')){
      this.imagen = event.target.files[0];
      console.log(this.imagen.size)
    }
    else{
      this.imagen = null;
      this.flashMessages.show('El archivo introduccido no es válido', {
        cssClass: 'alert-danger', timeout: 4000
      });
    }
  }

  cargarImagenPerfil(){
    if(this.imagen){
      if((this.imagen.type === 'image/jpeg' || 'image/jpg' || 'image/png') && this.imagen.size <= 2097152){ //si el archivo existe, el tipo es jpg,png o jpeg y su tamaño es <= 2mb
        const filePath = `users_images/${this.usuarioActivo.id}/${this.usuarioActivo.id}_profile`;
        const task = this.storage.upload(filePath,this.imagen);
        this.uploadPercent = task.percentageChanges();
        console.log('imagen subida');
        this.usuarioService.actualizarImageTrue(this.usuarioActivo.id);
        this.usuarioService.getImage(this.usuarioActivo.id).then(image => {
          this.image = image;
        })
        this.imagen = null;
      }
      else
        console.log("imagen nula");
    }
    else
      console.log("imagen no seleccionada");
  }

  guardarDatos(){
    if(this.imagen)
      this.cargarImagenPerfil();
    if(!this.datosUsuario.controls.name.invalid && !this.datosUsuario.controls.surnames.invalid && !this.datosUsuario.controls.pais.invalid && !this.datosUsuario.controls.telefono.invalid){
      this.usuarioService.modificarDatos(this.datosUsuario.value, this.usuarioActivo.id);
    }
  }

}
