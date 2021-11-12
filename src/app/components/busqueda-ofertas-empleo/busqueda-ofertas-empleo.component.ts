import { Oferta } from './../../models/oferta';
import { OfertasService } from './../../services/ofertas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-busqueda-ofertas-empleo',
  templateUrl: './busqueda-ofertas-empleo.component.html',
  styleUrls: ['./busqueda-ofertas-empleo.component.css']
})
export class BusquedaOfertasEmpleoComponent implements OnInit {

  categoria: string;
  observableOfertas: Observable<Oferta[]>;
  ofertas: Oferta[]=[];
  
  constructor(private router: Router, private route: ActivatedRoute, private ofertasService: OfertasService) { }

  ngOnInit(): void {
    this.categoria = this.route.snapshot.params['categoria'];
    this.observableOfertas = this.ofertasService.getOfertas(this.categoria);
    this.observableOfertas.subscribe(ofertas => this.ofertas=ofertas);
  }

}
