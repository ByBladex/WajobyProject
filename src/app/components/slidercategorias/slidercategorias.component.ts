import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-slidercategorias',
  templateUrl: './slidercategorias.component.html',
  styleUrls: ['./slidercategorias.component.css']
})
export class SlidercategoriasComponent implements OnInit {

  @ViewChild('section1') section1: ElementRef;
  @ViewChild('section2') section2: ElementRef;
  
  constructor() { }

  ngOnInit(): void {
  }

  section1Scroll(){
    this.section1.nativeElement.scrollIntoView({behavior: 'smooth'});
  }

  section2Scroll(){
    this.section2.nativeElement.scrollIntoView({behavior: 'smooth'});
  }
}
