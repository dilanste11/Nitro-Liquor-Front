import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ProviderDTO } from '../../../models/provider/provider.dto';


@Injectable({ providedIn: 'root' })
export class ProviderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/providers`;

  getProviders(): Observable<ProviderDTO[]> { return this.http.get<ProviderDTO[]>(this.apiUrl); }
  getProviderById(id: number): Observable<ProviderDTO> { return this.http.get<ProviderDTO>(`${this.apiUrl}/${id}`); }
  createProvider(provider: Partial<ProviderDTO>): Observable<ProviderDTO> { return this.http.post<ProviderDTO>(this.apiUrl, provider); }
  updateProvider(id: number, provider: Partial<ProviderDTO>): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, provider); }
  deleteProvider(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}