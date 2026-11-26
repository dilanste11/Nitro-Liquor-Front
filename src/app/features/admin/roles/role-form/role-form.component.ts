import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../../../core/services/role/role.service';
import { RoleDTO } from '../../../../models/role/role.dto';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roleId: number | null = null;
  isEditMode = false;
  isLoading = false;

  roleForm = this.fb.group({
    code: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.roleId = Number(id);
      this.isEditMode = true;
      this.roleService.getRoleById(this.roleId).subscribe({
        next: (role) => this.roleForm.patchValue({ 
          code: role.code, 
          description: role.description 
        }),
        error: (err) => console.error('Error cargando el rol', err)
      });
    }
  }

  onSubmit() {
    if (this.roleForm.invalid) return;
    this.isLoading = true;

   const roleData: Partial<RoleDTO> = {
      code: String(this.roleForm.value.code),
      description: this.roleForm.value.description ? String(this.roleForm.value.description) : undefined
    };

    if (this.isEditMode && this.roleId) {
      this.roleService.updateRole(this.roleId, roleData).subscribe({
        next: () => this.router.navigate(['/admin/roles']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    } else {
      this.roleService.createRole(roleData).subscribe({
        next: () => this.router.navigate(['/admin/roles']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    }
  }
}