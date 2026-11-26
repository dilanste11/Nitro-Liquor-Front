import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserDTO } from '../../../models/user/user.dto';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Users`; // Asegúrate de que el controlador sea 'Users'

  getUsers(): Observable<UserDTO[]> { return this.http.get<UserDTO[]>(this.apiUrl); }
  getUserById(id: number): Observable<UserDTO> { return this.http.get<UserDTO>(`${this.apiUrl}/${id}`); }
  createUser(user: Partial<UserDTO>): Observable<UserDTO> { return this.http.post<UserDTO>(this.apiUrl, user); }
  updateUser(id: number, user: Partial<UserDTO>): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, user); }
  deleteUser(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }

 getMyProfile(): Observable<UserDTO> { 
    return this.http.get<UserDTO>(`${this.apiUrl}/me`); 
  }

  updateMyProfile(user: Partial<UserDTO>): Observable<any> { 
    return this.http.put(`${this.apiUrl}/me`, user); 
  }
  // Cambiar contraseña (si ya creaste el endpoint en el backend)
  changePassword(dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, dto);
  }
}