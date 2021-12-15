import { DocumentData } from '@angular/fire/compat/firestore';
import { UsuarioService } from './../../services/usuario.service';
import { OfertasService } from './../../services/ofertas.service';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { Oferta } from 'src/app/models/oferta';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-solicitudes-oferta-modal',
  templateUrl: './solicitudes-oferta-modal.component.html',
  styleUrls: ['./solicitudes-oferta-modal.component.css']
})
export class SolicitudesOfertaModalComponent implements OnInit {
  
  listadoUsuariosSolicitudes:Usuario[] = [];
  userCV: Observable<string>[] = [];
  solicitudesOferta:DocumentData[] = [];

  @Input('ofertaSeleccionada') ofertaSeleccionada: Oferta;
  @Input('usuario') usuario: Oferta;
  constructor(private ofertasService: OfertasService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.listadoUsuariosSolicitudes = [];
    this.ofertasService.getSolicitudesOferta(this.ofertaSeleccionada.id, this.ofertaSeleccionada.categoria).subscribe(solicitudes => {
      this.solicitudesOferta = solicitudes;
      this.solicitudesOferta.map(solicitudUsuario =>{
        this.usuarioService.getUsuario(solicitudUsuario.id).subscribe(user => {
          if(!this.listadoUsuariosSolicitudes.includes(user)){
            this.listadoUsuariosSolicitudes.push(user)
            this.usuarioService.getCV(user.id).then(async cv => {
              this.userCV.push(cv);
            })
          }
        }).closed
      })
    }).closed;
  }

}
