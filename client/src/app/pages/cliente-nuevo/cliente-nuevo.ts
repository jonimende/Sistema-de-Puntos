import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../services/clientes';
import { Cliente } from '../../interfaces';

@Component({
  selector: 'app-cliente-nuevo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-nuevo.html',
  styleUrls: ['./cliente-nuevo.css']
})
export class ClienteNuevoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  @Input() dniInicial: string = ''; 
  @Output() clienteCreado = new EventEmitter<Cliente>(); 
  @Output() cancelar = new EventEmitter<void>(); 

  // Agregamos password al formulario
  registroForm: FormGroup = this.fb.group({
    dni: ['', Validators.required],
    nombre: ['', Validators.required],
    email: [''], 
    password: ['', [Validators.required, Validators.minLength(4)]] // <--- NUEVO
  });

  loading = false;
  errorMsg = '';

  ngOnInit() {
    if (this.dniInicial) {
      this.registroForm.patchValue({ dni: this.dniInicial });
    }
  }

  registrar() {
    if (this.registroForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    // Ya no mandamos password '123' fijo, sino el que escribió el cajero
    const nuevoCliente = this.registroForm.value;

    this.clienteService.createCliente(nuevoCliente).subscribe({
      next: (cliente: Cliente) => {
        this.loading = false;
        this.clienteCreado.emit(cliente); 
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.msg || 'Error al crear el cliente.';
      }
    });
  }
}