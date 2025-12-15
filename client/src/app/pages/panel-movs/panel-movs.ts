import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimientosService } from '../../services/movimientos';
import { Cliente } from '../../interfaces';

// 1. Importamos SweetAlert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-panel-movimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel-movs.html',
  styleUrls: ['./panel-movs.css']
})
export class PanelMovimientosComponent {
  private fb = inject(FormBuilder);
  private movimientosService = inject(MovimientosService);

  @Input() cliente!: Cliente;
  @Input() usuarioId!: number;
  
  @Output() operacionTerminada = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();

  movForm: FormGroup = this.fb.group({
    monto: ['', [Validators.required, Validators.min(1)]]
  });

  procesar(accion: 'SUMAR' | 'DESCONTAR') {
    if (this.movForm.invalid) {
        Swal.fire('Monto inválido', 'Ingresá un valor mayor a 0', 'warning');
        return;
    }

    const valor = this.movForm.value.monto;

    // Validación local de saldo (para no molestar al backend si es obvio)
    if (accion === 'DESCONTAR' && valor > this.cliente.puntos_actuales) {
      Swal.fire({
        icon: 'error',
        title: 'Saldo Insuficiente',
        text: `El cliente tiene ${this.cliente.puntos_actuales} puntos y quiere canjear ${valor}.`,
        confirmButtonColor: '#d33'
      });
      return;
    }

    // 1. ALERTA DE CARGA
    Swal.fire({
      title: accion === 'SUMAR' ? 'Cargando Puntos...' : 'Procesando Canje...',
      text: 'Aguarde un momento',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const peticion = accion === 'SUMAR'
      ? this.movimientosService.sumarPuntos({
          dni: this.cliente.dni,
          usuario_id: this.usuarioId,
          monto_compra: valor
        })
      : this.movimientosService.canjearPuntos({
          dni: this.cliente.dni,
          usuario_id: this.usuarioId,
          puntos_a_canjear: valor
        });

    peticion.subscribe({
      next: (res: any) => {
        // 2. ALERTA DE ÉXITO
        Swal.fire({
          icon: 'success',
          title: '¡Operación Exitosa!',
          text: res.msg, // "Se sumaron X puntos"
          confirmButtonText: 'Aceptar y Volver',
          confirmButtonColor: '#004aad',
          allowOutsideClick: false
        }).then((result) => {
            // 3. SOLO CUANDO EL USUARIO TOCA "OK", VOLVEMOS AL INICIO
            if (result.isConfirmed) {
                this.operacionTerminada.emit(res.msg);
            }
        });
      },
      error: (err) => {
        // 4. ALERTA DE ERROR
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.msg || 'No se pudo procesar la operación',
            confirmButtonColor: '#d33'
        });
      }
    });
  }
}