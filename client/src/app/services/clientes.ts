import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/environments';
import { Cliente } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService { // Ojo al nombre de la clase
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getClienteByDni(dni: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${dni}`);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
  }
}