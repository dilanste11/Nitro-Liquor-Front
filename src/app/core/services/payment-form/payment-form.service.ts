import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PaymentFormDTO } from '../../../models/payment/payment-form.dto';

@Injectable({ providedIn: 'root' })
export class PaymentFormService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/PaymentForms`;

  getPaymentForms(): Observable<PaymentFormDTO[]> { return this.http.get<PaymentFormDTO[]>(this.apiUrl); }
  getPaymentFormById(id: number): Observable<PaymentFormDTO> { return this.http.get<PaymentFormDTO>(`${this.apiUrl}/${id}`); }
  createPaymentForm(data: Partial<PaymentFormDTO>): Observable<PaymentFormDTO> { return this.http.post<PaymentFormDTO>(this.apiUrl, data); }
  updatePaymentForm(id: number, data: Partial<PaymentFormDTO>): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, data); }
  deletePaymentForm(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}