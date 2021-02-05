import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Venta } from '../models/venta';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private baseEndPoint = 'http://localhost:8080/sales'

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

  public listarVentas(page: string, size:string): Observable<any>{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<any>(`${this.baseEndPoint}/paginador`, {params: params, headers: this.agregarAuthorizationHeader() })
    .pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public listar(): Observable<Venta[]>{
    return this.http.get<Venta[]>(this.baseEndPoint, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public ver(id: number): Observable<Venta>{
    return this.http.get<Venta>(`${this.baseEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public crear(venta: Venta): Observable<Venta>{
    return this.http.post<Venta>(this.baseEndPoint, venta, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public editar(venta: Venta): Observable<Venta>{
    return this.http.put<Venta>(`${this.baseEndPoint}/${venta.saleId}`, venta, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
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
