import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
import { RoleService } from '../../../../core/services/role/role.service';
import { UserDTO } from '../../../../models/user/user.dto';
import { RoleDTO } from '../../../../models/role/role.dto';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userId: number | null = null;
  isEditMode = false;
  isProfileMode = false; // <-- NUEVO: Detecta si es el perfil propio del cliente
  isLoading = false;
  roles: RoleDTO[] = [];

  userForm = this.fb.group({
    document: ['', Validators.required],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    birthDate: [''],
    password: [''],
    rolId: [null, Validators.required]
  });

 ngOnInit() {
    this.loadRoles();

    const currentUrl = this.router.url;
    if (currentUrl.includes('/profile')) {
      this.isProfileMode = true;
      this.isEditMode = true;
      
      // SOLUCIÓN FRONTEND: Quitamos la obligación del rol para que deje guardar
      this.userForm.get('rolId')?.clearValidators();
      this.userForm.get('rolId')?.updateValueAndValidity();
      
      this.loadMyProfileData();
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.userId = Number(id);
        this.isEditMode = true;
        this.loadUserData(this.userId);
      } else {
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      }
    }
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error cargando roles', err)
    });
  }

  // Carga datos para el Admin editando a un usuario
  loadUserData(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (user: any) => this.patchFormValues(user),
      error: (err) => console.error('Error al cargar el usuario', err)
    });
  }

  // NUEVO: Carga datos para el cliente editando su propio perfil (/me)
  loadMyProfileData() {
    this.userService.getMyProfile().subscribe({
      next: (user: any) => this.patchFormValues(user),
      error: (err) => console.error('Error al cargar tu perfil', err)
    });
  }

  // Método auxiliar para no repetir el patchValue
  patchFormValues(user: any) {
    const formattedDate = user.birthDate ? user.birthDate.split('T')[0] : '';
    this.userForm.patchValue({
      document: user.document,
      name: user.name,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      birthDate: formattedDate,
      rolId: user.rolId
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    this.isLoading = true;

    const formValues = this.userForm.value;
    const userData: Partial<UserDTO> = {
      document: String(formValues.document),
      name: String(formValues.name),
      lastName: String(formValues.lastName),
      username: String(formValues.username),
      email: String(formValues.email),
      phoneNumber: formValues.phoneNumber ? String(formValues.phoneNumber) : undefined,      
    };

    if (!this.isProfileMode) {
      userData.rolId = Number(formValues.rolId);
    }

    if (formValues.birthDate) {
      userData.birthDate = String(formValues.birthDate);
    }
    if (formValues.password) {
      userData.password = String(formValues.password);
    }

    // NUEVO: Dependiendo de si es perfil propio o admin, redirige a sitios distintos
    if (this.isProfileMode) {
      this.userService.updateMyProfile(userData).subscribe({
        next: () => {
          this.isLoading = false;
          // Puedes redirigir al inicio o mostrar una alerta de éxito
          this.router.navigate(['/']); 
        },
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    } else if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => this.router.navigate(['/admin/users']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => this.router.navigate(['/admin/users']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    }
  }
}