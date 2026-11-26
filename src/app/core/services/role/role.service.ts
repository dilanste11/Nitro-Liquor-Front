import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RoleDTO } from '../../../models/role/role.dto';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Roles`; 

  getRoles(): Observable<RoleDTO[]> { return this.http.get<RoleDTO[]>(this.apiUrl); }
  getRoleById(id: number): Observable<RoleDTO> { return this.http.get<RoleDTO>(`${this.apiUrl}/${id}`); }
  createRole(role: Partial<RoleDTO>): Observable<RoleDTO> { return this.http.post<RoleDTO>(this.apiUrl, role); }
  updateRole(id: number, role: Partial<RoleDTO>): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, role); }
  deleteRole(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}