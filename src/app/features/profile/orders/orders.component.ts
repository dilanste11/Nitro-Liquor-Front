import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
// Ajusta la ruta a tu servicio real
import { MovementService } from '../../../core/services/movement/movement.service';
import { UiService } from '../../../core/services/ui/ui.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  private movementService = inject(MovementService);
  private uiService = inject(UiService);

  orders: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadMyOrders();
  }

  loadMyOrders() {
    this.isLoading = true;
    this.movementService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: () => {
        this.uiService.showToast('Error al cargar tu historial de pedidos', 'error');
        this.isLoading = false;
      }
    });
  }

  getStatusName(status: number): string {
    const statuses: Record<number, string> = {
      1: 'Pendiente',
      2: 'Empacando',
      3: 'Enviado',
      4: 'Entregado'
    };
    return statuses[status] || 'Desconocido';
  }
  
  getStatusColor(status: number): string {
    const colors: Record<number, string> = {
      1: 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20',
      2: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
      3: 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
      4: 'bg-green-500/20 text-green-400 border border-green-500/20'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
  }
}