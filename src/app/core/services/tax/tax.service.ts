import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { TaxDTO } from '../../../models/tax/tax.dto';

@Injectable({ providedIn: 'root' })
export class TaxService {
  private http = inject(HttpClient);
  // Asegúrate de que este sea el nombre correcto de tu controlador en C# (Taxes o ProductTaxes)
  private apiUrl = `${environment.apiUrl}/ProductTaxes`; 

  getTaxes(): Observable<TaxDTO[]> { return this.http.get<TaxDTO[]>(this.apiUrl); }
  getTaxById(id: number): Observable<TaxDTO> { return this.http.get<TaxDTO>(`${this.apiUrl}/${id}`); }
  createTax(tax: Partial<TaxDTO>): Observable<TaxDTO> { return this.http.post<TaxDTO>(this.apiUrl, tax); }
  updateTax(id: number, tax: Partial<TaxDTO>): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, tax); }
  deleteTax(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}