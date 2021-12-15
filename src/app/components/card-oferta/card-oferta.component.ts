import { Observable } from 'rxjs';
import { OfertasService } from './../../services/ofertas.service';
import { Component, OnInit, Input} from '@angular/core';
import { Oferta } from './../../models/oferta';

@Component({
  selector: 'app-card-oferta',
  templateUrl: './card-oferta.component.html',
  styleUrls: ['./card-oferta.component.css']
})
export class CardOfertaComponent implements OnInit {

  display: any;
  imagen: Observable<string>;

  @Input("oferta") oferta: Oferta;

  constructor(private ofertaService: OfertasService) { }

  ngOnInit(): void {
    if(window.innerWidth < 768)
      this.display = "block";
    else
      this.display = "flex";
    this.ofertaService.getImage(this.oferta.id).then(img => {
      if(img){
        img.subscribe(imagen => {
          this.imagen = imagen;
        })
      }
    });
  }
}
