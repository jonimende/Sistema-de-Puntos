import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../services/productos';
import { Producto } from '../../interfaces';

// 1. IMPORTAMOS SWEETALERT
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos-admin.html',
  styleUrls: ['./productos-admin.css']
})
export class ProductosAdminComponent implements OnInit, OnChanges {
  
  @Input() vista: 'lista' | 'formulario' = 'lista';
  @Input() esAdmin: boolean = false; 
  @Input() productoAEditar: Producto | null = null; 

  @Output() onEditar = new EventEmitter<Producto>(); 
  @Output() onCancelar = new EventEmitter<void>(); 

  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);

  productos: Producto[] = [];
  selectedFile: File | null = null;
  mensaje: string = '';
  
  productoForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    if (this.vista === 'lista') {
      this.cargarProductos();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productoAEditar'] && this.productoAEditar) {
      this.llenarFormulario(this.productoAEditar);
    }
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error(err)
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  llenarFormulario(producto: Producto) {
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio
    });
    this.mensaje = `✏️ Editando: ${producto.nombre}`;
  }

  limpiarFormulario() {
    this.productoForm.reset();
    this.selectedFile = null;
    this.mensaje = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
    
    this.onCancelar.emit(); 
  }

  // --- ACÁ EMPIEZAN LOS CAMBIOS DE ALERTAS LINDAS ---

  onSubmit() {
    if (this.productoForm.invalid) {
      // Alerta de Error chiquita (Toast)
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Por favor completá los campos obligatorios.',
        confirmButtonColor: '#004aad'
      });
      return;
    }

    // Alerta de carga (Loading)
    Swal.fire({
      title: 'Procesando...',
      text: 'Subiendo datos e imagen',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('descripcion', this.productoForm.get('descripcion')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value);
    
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    // EDICIÓN
    if (this.productoAEditar && this.productoAEditar.id !== undefined) {
      this.productoService.updateProducto(this.productoAEditar.id, formData).subscribe({
        next: () => {
          // ALERTA DE ÉXITO
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'El producto se guardó correctamente.',
            confirmButtonColor: '#004aad'
          });
          this.limpiarFormulario();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
        }
      });
    } 
    // CREACIÓN
    else {
      if (!this.selectedFile) {
        Swal.fire('Falta la foto', 'La imagen es obligatoria para nuevos productos.', 'warning');
        return;
      }
      this.productoService.crearProducto(formData).subscribe({
        next: () => {
            // ALERTA DE ÉXITO
            Swal.fire({
                icon: 'success',
                title: '¡Creado!',
                text: 'Nuevo sabor agregado al catálogo.',
                confirmButtonColor: '#004aad'
            });
            this.limpiarFormulario();
        },
        error: () => {
            Swal.fire('Error', 'No se pudo crear el producto', 'error');
        }
      });
    }
  }

  // --- LÓGICA DE BORRADO CON CONFIRMACIÓN LINDA ---
  clickEditar(p: Producto) {
    this.onEditar.emit(p); 
  }

  clickEliminar(id: number | undefined) {
    if (!id) return;

    // Pregunta de confirmación Estilizada
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No vas a poder recuperar este producto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Rojo para borrar
      cancelButtonColor: '#3085d6', // Azul para cancelar
      confirmButtonText: 'Sí, borrarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      
      // Si el usuario dijo que SÍ
      if (result.isConfirmed) {
        
        // Mostramos cargando mientras borra...
        Swal.showLoading();

        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            this.productos = this.productos.filter(p => p.id !== id);
            
            // Avisamos que se borró
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El producto fue borrado.',
                icon: 'success',
                confirmButtonColor: '#004aad'
            });
          },
          error: () => Swal.fire('Error', 'Hubo un problema al eliminar', 'error')
        });
      }
    });
  }
}