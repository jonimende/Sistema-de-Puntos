import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../services/productos';
import { Producto } from '../../interfaces';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos-admin.html',
  styleUrls: ['./productos-admin.css']
})
export class ProductosAdminComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);

  productos: Producto[] = [];
  selectedFile: File | null = null;
  mensaje: string = '';

  // Formulario sin el campo imagen (se maneja aparte)
  productoForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  // Detecta cuando el usuario elige un archivo
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.productoForm.invalid || !this.selectedFile) {
      this.mensaje = '⚠️ Completá todos los campos y elegí una foto.';
      return;
    }

    this.mensaje = '⏳ Subiendo...';

    // Empaquetamos todo en un FormData
    const formData = new FormData();
    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('descripcion', this.productoForm.get('descripcion')?.value);
    formData.append('precio', this.productoForm.get('precio')?.value);
    formData.append('imagen', this.selectedFile);

    this.productoService.crearProducto(formData).subscribe({
      next: () => {
        this.mensaje = '✅ ¡Producto creado!';
        this.productoForm.reset();
        this.selectedFile = null;
        
        // Limpiar visualmente el input file
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

        this.cargarProductos();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = '❌ Error al subir.';
      }
    });
  }
}