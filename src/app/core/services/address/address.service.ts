import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'; // Ajusta la ruta
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  // Apunta al nombre exacto de tu controlador en C#
  private apiUrl = `${environment.apiUrl}/UserAddresses`;

  // Llama a tu endpoint: [HttpGet("user/{userId}")]
  getAddressesByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Llama a tu endpoint POST por defecto en el controlador
  createAddress(addressData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, addressData);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}