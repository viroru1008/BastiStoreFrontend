import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ventaproducto } from '../models/ventaproducto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VentaproductoService {

  private baseEndPoint = 'http://localhost:8080/saleproducts'

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.cabeceras.append('Authorization', 'Bearer ' + token);
    }
    return this.cabeceras;
  }

  private isNoAuthorizado(e): boolean{
    if(e.status == 403){
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

  public crear(ventaProducto: Ventaproducto): Observable<Ventaproducto>{
    return this.http.post<Ventaproducto>(this.baseEndPoint, ventaProducto, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public eliminar(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }
}
