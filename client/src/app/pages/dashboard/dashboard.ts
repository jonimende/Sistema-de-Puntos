import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// 1. Imports Correctos de Servicios
import { ClienteService } from '../../services/clientes'; 
import { MovimientosService } from '../../services/movimientos';
import { AuthService } from '../../services/auth';

// 2. Import Correcto de la Interfaz (Solo uno)
import { Cliente } from '../../interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  private fb = inject(FormBuilder);
  
  // 3. Inyeccion con los nombres de clase correctos
  private clienteService = inject(ClienteService);
  private movimientosService = inject(MovimientosService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cliente: Cliente | null = null;
  mensaje: string = '';
  modoRegistro: boolean = false;
  usuarioId = 1; 

  searchForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.minLength(7)]]
  });

  movimientoForm: FormGroup = this.fb.group({
    monto: ['', [Validators.required, Validators.min(1)]]
  });

  registroForm: FormGroup = this.fb.group({
    dni: ['', Validators.required],
    nombre: ['', Validators.required],
    email: [''], 
  });

  buscarCliente() {
    this.mensaje = '';
    this.cliente = null;
    this.modoRegistro = false;
    
    const dni = this.searchForm.value.dni;

    // 4. Tipado explicito en el subscribe (data: Cliente)
    this.clienteService.getClienteByDni(dni).subscribe({
      next: (data: Cliente) => {
        this.cliente = data;
      },
      error: () => {
        this.mensaje = 'Cliente no encontrado. ¿Desea registrarlo?';
        this.modoRegistro = true;
        this.registroForm.patchValue({ dni: dni });
      }
    });
  }

  registrarCliente() {
    this.clienteService.createCliente(this.registroForm.value).subscribe({
      next: (nuevoCliente: Cliente) => {
        this.cliente = nuevoCliente;
        this.modoRegistro = false;
        this.mensaje = '¡Cliente registrado con éxito!';
      },
      error: (err: any) => {
        this.mensaje = 'Error al registrar: ' + (err.error?.msg || 'Error desconocido');
      }
    });
  }

  realizarMovimiento(tipo: 'SUMAR' | 'CANJEAR') {
    if (!this.cliente || this.movimientoForm.invalid) return;

    const monto = this.movimientoForm.value.monto;
    
    if (tipo === 'SUMAR') {
      const body = {
        dni: this.cliente.dni,
        monto_compra: monto,
        usuario_id: this.usuarioId
      };
      
      // 5. Tipado explicito del resultado (res: any)
      this.movimientosService.sumarPuntos(body).subscribe({
        next: (res: any) => {
          this.mensaje = res.msg;
          if (this.cliente) this.cliente.puntos_actuales = res.nuevo_saldo;
          this.movimientoForm.reset();
        },
        error: (err: any) => {
          this.mensaje = 'Error al sumar: ' + (err.error?.msg || 'Intente de nuevo');
        }
      });
    } 
    else if (tipo === 'CANJEAR') {
      const body = {
        dni: this.cliente.dni,
        puntos_a_canjear: monto,
        usuario_id: this.usuarioId
      };

      this.movimientosService.canjearPuntos(body).subscribe({
        next: (res: any) => {
          this.mensaje = res.msg;
          if (this.cliente) this.cliente.puntos_actuales = res.nuevo_saldo;
          this.movimientoForm.reset();
        },
        error: (err: any) => {
          this.mensaje = err.error?.msg || 'Error al canjear';
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}