import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/environments';
import { Producto } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Obtener todos los helados para la lista
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }

  // Crear producto (IMPORTANTE: Recibe FormData para poder subir la imagen)
  crearProducto(formData: FormData): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/productos`, formData);
  }
}