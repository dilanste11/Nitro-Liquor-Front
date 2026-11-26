import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MovementCreateDTO } from '../../../models/movement/movement-create.dto';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Movements`;

  createMovement(movement: MovementCreateDTO): Observable<any> {
    return this.http.post(this.apiUrl, movement);
  }

  getMovements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMovementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getMyOrders(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/my-orders`);
  }

  getAllOrders(): Observable<any[]> {    
    return this.http.get<any[]>(`${this.apiUrl}`); 
  }
  
  updateOrderStatus(orderId: number, status: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  getEcommerceOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ecommerce-orders`); 
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}