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

  // 1. Obtener todos los helados (GET)
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }

  crearProducto(formData: FormData): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/productos`, formData);
  }

  updateProducto(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, formData);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}