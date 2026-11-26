import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
  monthlySales: number;
  totalOrdersThisMonth: number;
  bestSellingDay: string;
  topProduct: string;
  mostExpensiveProduct: string;
  lowStockProducts: { name: string; stock: number }[];
  last7DaysSales: { date: string; total: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Dashboard`; // Asegúrate de que coincida con la ruta de tu controlador C#

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
}