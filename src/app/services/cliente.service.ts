import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseEndPoint = 'http://localhost:8080/clients'

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

  public listarClientes(page: string, size:string): Observable<any>{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<any>(`${this.baseEndPoint}/paginador`, {params: params, headers: this.agregarAuthorizationHeader() })
    .pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public listar(): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.baseEndPoint, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public ver(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.baseEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public crear(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.baseEndPoint, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
      this.isNoAuthorizado(e);
      return throwError(e);
    }));
  }

  public editar(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.baseEndPoint}/${cliente.clientId}`, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(catchError(e => {
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
