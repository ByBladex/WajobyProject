import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule} from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { environment } from '../environments/environment';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/compat/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CabeceroComponent } from './components/cabecero/cabecero.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RecuperarPassComponent } from './components/recuperar-pass/recuperar-pass.component';
import { PiePaginaComponent } from './components/pie-pagina/pie-pagina.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { PortadaComponent } from './components/portada/portada.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlidercategoriasComponent } from './components/slidercategorias/slidercategorias.component';
import { InfoPortadaComponent } from './components/info-portada/info-portada.component';
import { BusquedaOfertasEmpleoComponent } from './components/busqueda-ofertas-empleo/busqueda-ofertas-empleo.component';
import { DetallesOfertaEmpleoComponent } from './components/detalles-oferta-empleo/detalles-oferta-empleo.component';
import { ModalCrearOfertaComponent } from './components/modal-crear-oferta/modal-crear-oferta.component';
import { CardOfertaComponent } from './components/card-oferta/card-oferta.component';
import { ListaOfertasPerfilComponent } from './components/lista-ofertas-perfil/lista-ofertas-perfil.component';
import { ItemOfertaPerfilComponent } from './components/item-oferta-perfil/item-oferta-perfil.component';
import { NoJobComponent } from './components/no-job/no-job.component';
import { ModalEditarOfertaComponent } from './components/modal-editar-oferta/modal-editar-oferta.component';
import { CargaCurriculumComponent } from './components/carga-curriculum/carga-curriculum.component';

@NgModule({
  declarations: [
    AppComponent,
    CabeceroComponent,
    LoginComponent,
    RegistroComponent,
    RecuperarPassComponent,
    PiePaginaComponent,
    TerminosComponent,
    NoEncontradoComponent,
    PortadaComponent,
    PerfilComponent,
    SlidercategoriasComponent,
    InfoPortadaComponent,
    BusquedaOfertasEmpleoComponent,
    DetallesOfertaEmpleoComponent,
    ModalCrearOfertaComponent,
    CardOfertaComponent,
    ListaOfertasPerfilComponent,
    ItemOfertaPerfilComponent,
    NoJobComponent,
    ModalEditarOfertaComponent,
    CargaCurriculumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firestore, 'Wajoby'),
    AngularFirestoreModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),
    AngularFireAuthModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
  ],
  providers: [AuthGuard, {provide: SETTINGS, useValue:{}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
