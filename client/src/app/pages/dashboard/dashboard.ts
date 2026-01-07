import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { finalize } from 'rxjs/operators'; // <--- IMPORTANTE: Necesario para el arreglo

import { ProductosAdminComponent } from '../productos-admin/productos-admin';
import { ClienteNuevoComponent } from '../cliente-nuevo/cliente-nuevo';
import { PanelMovimientosComponent } from '../panel-movs/panel-movs';

import { ClienteService } from '../../services/clientes';
import { AuthService } from '../../services/auth';
import { Cliente, Producto } from '../../interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductosAdminComponent,
    PanelMovimientosComponent,
    ClienteNuevoComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  // --- DATOS USUARIO ---
  usuarioRol: string = '';
  usuarioNombre: string = '';
  usuarioId: number = 0;

  // --- NAVEGACIÓN ---
  seccionActiva: string = 'CAJA'; // Por defecto para Admin/Empleados

  // --- DATOS ---
  miPerfilCliente: Cliente | null = null;
  clienteBuscado: Cliente | null = null;
  productoParaEditar: Producto | null = null;

  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  loading: boolean = false;

  searchForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.minLength(7)]]
  });

  ngOnInit() {
    const token = this.authService.getToken();
    
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('🔑 Token Decodificado:', decoded);

        this.usuarioId = decoded.id;
        this.usuarioNombre = decoded.username || decoded.nombre;
        
        // Convertimos a minúsculas por seguridad
        this.usuarioRol = (decoded.rol || 'cliente').toLowerCase();

        // --- LÓGICA EXCLUSIVA PARA CLIENTES ---
        if (this.usuarioRol === 'cliente') {
          // Buscamos el DNI en el token (campo 'dni' o 'username')
          const dniCliente = decoded.dni || decoded.username;
          
          if (dniCliente) {
              console.log('🔎 Buscando perfil para DNI:', dniCliente);
              this.cargarMiPerfil(dniCliente);
          } else {
              this.mostrarMensaje('Error: No se encontró DNI en tu sesión', 'error');
          }
        }

      } catch (e) {
        console.error('Error al leer el token', e);
        this.logout();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  // --- MÉTODOS DE NAVEGACIÓN (ADMIN/EMPLEADO) ---
  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    this.mensaje = '';
    
    if (seccion !== 'CAJA') {
        this.clienteBuscado = null;
        this.searchForm.reset();
    }
    if (seccion !== 'NUEVO_SABOR') {
        this.productoParaEditar = null;
    }
  }

  irAEditarProducto(producto: Producto) {
    this.productoParaEditar = producto;
    this.seccionActiva = 'NUEVO_SABOR';
  }

  volverAListaProductos() {
    this.productoParaEditar = null;
    this.seccionActiva = 'PRODUCTOS';
  }

  // --- LÓGICA DE CLIENTE ---
  cargarMiPerfil(dni: string) {
    this.clienteService.getClienteByDni(dni).subscribe({
        next: (data) => {
            console.log('✅ Perfil recibido:', data);
            
            if (data) {
                this.miPerfilCliente = data;
                this.cd.detectChanges();
            } else {
                console.warn('⚠️ El backend devolvió datos vacíos');
            }
        },
        error: (err) => {
            console.error('❌ Error API:', err);
            this.mostrarMensaje('No se pudieron cargar tus puntos.', 'error');
        }
    });
  }

  // --- LÓGICA CAJA (ADMIN) ---
  buscarCliente() {
    if (this.searchForm.invalid) return;

    this.loading = true; // Prendemos el spinner
    this.mensaje = '';
    this.clienteBuscado = null;
    
    const dni = this.searchForm.value.dni;

    this.clienteService.getClienteByDni(dni)
      .pipe(
        // finalize asegura que el loading se apague SIEMPRE (éxito, error o caché)
        finalize(() => {
            this.loading = false;
            this.cd.detectChanges(); // Forzamos actualización visual
            console.log('🔄 Búsqueda finalizada');
        })
      )
      .subscribe({
        next: (data: Cliente) => {
          this.clienteBuscado = data;
        },
        error: (err) => {
          console.error(err); // Logueamos el error para debug
          this.mostrarMensaje('Cliente no encontrado.', 'error');
        }
      });
  }

  onOperacionTerminada(msg: string) {
    this.mostrarMensaje(msg, 'success');
    setTimeout(() => { 
        this.clienteBuscado = null;
        this.searchForm.reset();
        this.mensaje = '';
    }, 3000);
  }

  onClienteCreado(nuevoCliente: Cliente) {
    this.mostrarMensaje('¡Cliente creado!', 'success');
    this.seccionActiva = 'CAJA';
    this.clienteBuscado = nuevoCliente;
  }

  mostrarMensaje(texto: string, tipo: 'success' | 'error') {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    if (tipo === 'error') setTimeout(() => this.mensaje = '', 5000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
