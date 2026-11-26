import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// Ajusta estas rutas a la ubicación real de tus servicios
import { AuthService } from '../../../core/services/auth/auth.service';
import { UiService } from '../../../core/services/ui/ui.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private uiService = inject(UiService);
  private router = inject(Router);

  isLoading = false;

registerForm: FormGroup = this.fb.group({
    document: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    const { confirmPassword, ...userData } = this.registerForm.value;

    // Nota: Si tu backend requiere explícitamente el RoleId para crear un cliente, 
    // agrégalo aquí (ej. userData.roleId = 3). Lo ideal es que el C# lo asigne por defecto.
    
    this.authService.register(userData).subscribe({
      next: () => {
        this.uiService.showToast('Cuenta creada con éxito. ¡Bienvenido!', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.uiService.showToast(err.error?.message || 'Error al registrar la cuenta', 'error');
        this.isLoading = false;
      }
    });
  }
}