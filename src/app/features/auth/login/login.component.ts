import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], // Importamos los formularios reactivos
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Definimos el formulario con sus validaciones
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]] // Usamos el nombre que espera tu DTO
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Llamamos al servicio pasando los valores del formulario
    this.authService.login(this.loginForm.value as any).subscribe({
      next: (response) => {
        const role = this.authService.getUserRole();

        if (role === 'ADMIN' || role === 'Trabajador') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']); 
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Credenciales incorrectas o error en el servidor.';
        console.error(err);
      }
    });
  }
}