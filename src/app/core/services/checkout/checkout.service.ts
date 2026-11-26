import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Checkout`;

  processCheckout(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/process`, payload);
  }
}