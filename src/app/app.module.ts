import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductosFormComponent } from './components/productos/productos-form.component';
import { VentasFormComponent } from './components/ventas/ventas-form.component';
import { VentasDetalleComponent } from './components/ventas/ventas-detalle.component'
import { ClientesFormComponent } from './components/clientes/clientes-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    ClientesComponent,
    ClientesFormComponent,
    VentasComponent,
    MenuComponent,
    LoginComponent,
    ProductosFormComponent,
    VentasFormComponent,
    VentasDetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
