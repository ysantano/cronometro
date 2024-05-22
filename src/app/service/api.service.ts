// api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //http://sanyoma.com/API_ngastos/gastos
  //private apiUrl = 'http://sanyoma.com/API_ngastos'; // Reemplaza con la URL de tu servicio
  private apiUrl = 'https://sanyoma.com/API_naosports';
  public jsonDataJuegos: any[] = [];
  public idJuego: any;

  constructor(private http: HttpClient) {}

  // Ejemplo de solicitud GET
  getDatos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/temporadas?juegosTodos`).pipe(
      catchError((error) => {
        // Manejar errores aquí
        throw error;
      })
    );
  }

  // Ejemplo de solicitud POST
  postDatos(datos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/datos`, datos, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError((error) => {
        // Manejar errores aquí
        throw error;
      })
    );
  }

  // Ejemplo de solicitud PUT
  putDatos(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/datos/${id}`, datos, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError((error) => {
        // Manejar errores aquí
        throw error;
      })
    );
  }

  // Ejemplo de solicitud DELETE
  deleteDatos(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/datos/${id}`).pipe(
      catchError((error) => {
        // Manejar errores aquí
        throw error;
      })
    );
  }
}
