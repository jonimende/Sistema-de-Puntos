import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/environments';
import { AuthResponse, Usuario } from '../interfaces';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Login para Staff (Admin/Vendedor)
  login(credentials: {username: string, password: string}) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/usuarios/login`, credentials)
      .pipe(
        tap(resp => {
          if (resp.token) {
            localStorage.setItem('token', resp.token);
            // Opcional: Guardar usuario en localstorage o signal
          }
        })
      );
  }

  register(datosCliente: any): Observable<any> {
    // Apunta a la ruta pública que creamos antes
    return this.http.post(`${this.apiUrl}/clientes/registrarse`, datosCliente);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Verifica si está logueado
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true si existe
  }
  
  // Obtener rol desde el token
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.rol;
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
}