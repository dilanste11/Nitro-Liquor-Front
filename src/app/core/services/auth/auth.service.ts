import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LoginRequestDTO } from '../../../models/auth/login-request.dto';
import { LoginResponseDTO } from '../../../models/auth/login-response.dto';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`; 
  
  constructor(private http: HttpClient) {}

  login(credentials: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; 
  }

  // --- NUEVO MÉTODO PARA EXTRAER EL ROL DEL JWT ---
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // El JWT tiene 3 partes separadas por puntos (header.payload.signature)
      const payloadBase64 = token.split('.')[1];
      // Decodificamos el Base64 (atob) y lo convertimos a objeto JSON
      const payloadDecoded = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecoded);

      // En .NET, ClaimTypes.Role suele generar esta clave larga por defecto.
      // También buscamos 'role' o 'rol' en caso de que lo hayas personalizado en el backend.
      const netRoleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      
      return payloadJson[netRoleClaim] || payloadJson.role || payloadJson.rol || null;
    } catch (error) {
      console.error('Error al decodificar el token JWT', error);
      return null;
    }
  }

  getUserName(): string {
    const token = this.getToken();
    if (!token) return 'Usuario';
    try {
      const payloadJson = JSON.parse(atob(token.split('.')[1]));
      const netNameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
      return payloadJson[netNameClaim] || payloadJson.name || 'Usuario';
    } catch { return 'Usuario'; }
  }

  getUserEmail(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payloadJson = JSON.parse(atob(token.split('.')[1]));
      const netEmailClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
      return payloadJson[netEmailClaim] || payloadJson.email || '';
    } catch { return ''; }
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) return 0;
    try {
      const payloadJson = JSON.parse(atob(token.split('.')[1]));
      const netIdClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
      return Number(payloadJson[netIdClaim] || payloadJson.nameid || payloadJson.sub || 0);
    } catch { return 0; }
  }
}