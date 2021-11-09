import { Component, OnInit, Input} from '@angular/core';
import { Oferta } from './../../models/oferta';

@Component({
  selector: 'app-card-oferta',
  templateUrl: './card-oferta.component.html',
  styleUrls: ['./card-oferta.component.css']
})
export class CardOfertaComponent implements OnInit {

  @Input("oferta") oferta: Oferta;

  constructor() { }

  ngOnInit(): void {
  }

}
