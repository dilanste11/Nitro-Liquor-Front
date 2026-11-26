import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovementService } from '../../../core/services/movement/movement.service';
import { UiService } from '../../../core/services/ui/ui.service';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './manage-orders.component.html'
})
export class ManageOrdersComponent implements OnInit {
  private movementService = inject(MovementService);
  private uiService = inject(UiService);

  selectedOrder: any = null;
  isModalOpen = false;
  orders: any[] = [];
  isLoading = true;

  // Lista de estados para iterar en el select del HTML
  statusOptions = [
    { value: 1, label: 'Pendiente' },
    { value: 2, label: 'Empacando' },
    { value: 3, label: 'Enviado' },
    { value: 4, label: 'Entregado' },
    { value: 5, label: 'Cancelado' }
  ];

  ngOnInit() {
    this.loadAllOrders();
  }

  loadAllOrders() {
    this.isLoading = true;
    this.movementService.getEcommerceOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: () => {
        this.uiService.showToast('Error al cargar las órdenes', 'error');
        this.isLoading = false;
      }
    });
  }

  onStatusChange(orderId: number, newStatus: number) {
    // Convertimos a número por si el select lo envía como string
    const statusId = Number(newStatus); 
    
    this.movementService.updateOrderStatus(orderId, statusId).subscribe({
      next: () => {
        this.uiService.showToast(`Estado de la orden #${orderId} actualizado`, 'success');
      },
      error: (err) => {
        this.uiService.showToast('Error al actualizar el estado', 'error');
        // Recargamos para revertir el select visualmente si falla en el backend
        this.loadAllOrders(); 
      }
    });
  }

  getStatusColor(status: number): string {
    const colors: Record<number, string> = {
      1: 'bg-yellow-500/20 text-yellow-500',
      2: 'bg-blue-500/20 text-blue-400',
      3: 'bg-purple-500/20 text-purple-400',
      4: 'bg-green-500/20 text-green-400',
      5: 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  }

  openOrderDetails(orderId: number) {
    this.movementService.getOrderById(orderId).subscribe({
      next: (data) => {
        this.selectedOrder = data;
        this.isModalOpen = true;
      },
      error: () => {
        this.uiService.showToast('No se pudieron cargar los detalles de la orden', 'error');
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }
}