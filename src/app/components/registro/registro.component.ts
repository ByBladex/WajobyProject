import { Pais } from './../../models/pais.model';
import { UsuarioService } from './../../services/usuario.service';
import { LoginService } from './../../services/login.service';
import { Usuario } from './../../models/usuario';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from '@firebase/firestore';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  @ViewChild('pais') pais:string;

  registroForm: FormGroup;
  usuario: Usuario={};
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

  constructor(private router: Router, private flashMessages: FlashMessagesService, private loginService: LoginService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.router.navigate(['/']);
      }
    })
    this.registroForm = new FormGroup({
      username: new FormControl ('', Validators.required),
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', [Validators.required, Validators.minLength(6)]),
      pais: new FormControl ('', Validators.required),
      terms: new FormControl ('', [Validators.required, Validators.requiredTrue])
    });
    //Get Countries
    /*this.usuarioService.getCountries().subscribe((data) => {
      if(data.exists){
        this.paises = data.get('countries');
        this.paises.sort();
        console.log(this.paises);
      }
    });*/
  }

  registro(){
    if(this.registroForm.controls.pais.invalid || this.registroForm.controls.terms.invalid || this.registroForm.controls.password.invalid || this.registroForm.controls.email.invalid || this.registroForm.controls.username.invalid){
        this.flashMessages.show('Debes rellenar completamente el formulario de registro', {
          cssClass: 'alert-danger', timeout: 4000
        });
    }
    else{
      this.loginService.registrarse(this.registroForm.controls.email.value, this.registroForm.controls.password.value).then( res => {
        this.loginService.getAuth().subscribe(auth =>{
          if(auth){
            this.router.navigate(['/']);
            this.usuario.id = auth.uid;
            this.usuario.email = auth.email;
            this.usuario.pais = this.registroForm.controls.pais.value;
            this.usuario.cv = false;
            this.usuario.image = 'https://firebasestorage.googleapis.com/v0/b/wajoby-8fbf2.appspot.com/o/users_images%2Favatar_default.jpg?alt=media&token=88f80322-e45b-4968-8e19-075a0ddaed6b';
            this.usuario.fechaRegistro = Timestamp.now();
            this.usuario.ultimaSesion = Timestamp.now();
            this.usuario.usuario = this.registroForm.controls.username.value;
            this.usuarioService.registrarUsuarioDB(this.usuario);
          }
        }).remove
      }).catch(error => {
        this.flashMessages.show(error.message, {
          cssClass: 'alert-danger', timeout: 4000
        });
      });
    }
  }
}
