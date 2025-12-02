import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  sumarPuntos(body: { dni: string, monto_compra: number, usuario_id: number }) {
    return this.http.post(`${this.apiUrl}/movimientos/sumar`, body);
  }

  canjearPuntos(body: { dni: string, puntos_a_canjear: number, usuario_id: number }) {
    return this.http.post(`${this.apiUrl}/movimientos/canjear`, body);
  }
}