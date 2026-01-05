import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth'; // Asegúrate de la ruta
import { Router, RouterLink } from '@angular/router'; // Importamos RouterLink para el botón de "Volver"
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    dni: ['', [Validators.required, Validators.minLength(7)]], // DNI Argentino usualmente 7-8
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMsg: string = '';
  successMsg: string = ''; // Para mostrar mensaje verde si sale bien

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.errorMsg = '';
    this.successMsg = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.successMsg = '¡Cuenta creada con éxito! Redirigiendo al login...';
        // Esperamos 2 segundos para que lea el mensaje y lo mandamos al login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        // El backend devuelve msg en caso de error (ej: DNI repetido)
        this.errorMsg = err.error.msg || 'Error al registrarse';
      }
    });
  }
}