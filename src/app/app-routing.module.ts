import { DetallesOfertaEmpleoComponent } from './components/detalles-oferta-empleo/detalles-oferta-empleo.component';
import { BusquedaOfertasEmpleoComponent } from './components/busqueda-ofertas-empleo/busqueda-ofertas-empleo.component';
import { AuthGuard } from './guards/auth.guard';
import { PerfilComponent } from './components/perfil/perfil.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { RecuperarPassComponent } from './components/recuperar-pass/recuperar-pass.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { PortadaComponent } from './components/portada/portada.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: PortadaComponent},
  {path: 'ofertas/:categoria', component: BusquedaOfertasEmpleoComponent},
  {path: 'ofertas/:categoria/:id', component: DetallesOfertaEmpleoComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  {path: 'recuperacion', component: RecuperarPassComponent},
  {path: 'terminos', component: TerminosComponent},
  {path: '**', component: NoEncontradoComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
