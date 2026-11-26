import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../../../core/services/role/role.service';
import { RoleDTO } from '../../../../models/role/role.dto';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './role-list.component.html'
})
export class RoleListComponent implements OnInit {
  private roleService = inject(RoleService);
  
  roles: RoleDTO[] = [];
  isLoading = true;

  ngOnInit() { this.loadRoles(); }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar roles', err);
        this.isLoading = false;
      }
    });
  }

  deleteRole(id: number) {
    if(confirm('¿Estás seguro de eliminar este rol?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => this.loadRoles(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }
}