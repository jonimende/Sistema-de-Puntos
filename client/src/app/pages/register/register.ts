import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth'; // Corregido a .service
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './register.html', // Asegúrate que coincida con tu archivo real
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    dni: ['', [Validators.required, Validators.minLength(7)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]] // Mejor 6 caracteres
  });

  errorMsg: string = '';
  successMsg: string = '';

  onSubmit() {
    if (this.registerForm.invalid) return;

    // Limpiamos mensajes previos
    this.errorMsg = '';
    this.successMsg = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        // 1. Mostrar mensaje de éxito
        this.successMsg = '¡Cuenta creada con éxito! Redirigiendo al login...';
        
        // 2. CONGELAR el formulario para evitar doble clic o edición
        this.registerForm.disable();

        // 3. Esperar 2 segundos y redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        // Mostrar error y asegurar que el formulario siga editable
        this.errorMsg = err.error.msg || 'Error al registrarse';
        this.registerForm.enable();
      }
    });
  }
}