import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ShippingMethodService } from '../../../../core/services/shipping-method/shipping-method.service';
import { UiService } from '../../../../core/services/ui/ui.service';

@Component({
  selector: 'app-shipping-method-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './shipping-method-list.component.html'
})
export class ShippingMethodListComponent implements OnInit {
  private shippingService = inject(ShippingMethodService);
  private uiService = inject(UiService);

  shippingMethods: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadMethods();
  }

  loadMethods() {
    this.isLoading = true;
    this.shippingService.getAll().subscribe({
      next: (data) => {
        this.shippingMethods = data;
        this.isLoading = false;
      },
      error: () => {
        this.uiService.showToast('Error al cargar los métodos de envío', 'error');
        this.isLoading = false;
      }
    });
  }

  deleteMethod(id: number) {
    if (confirm('¿Estás seguro de eliminar este método de envío?')) {
      this.shippingService.delete(id).subscribe({
        next: () => {
          this.uiService.showToast('Método eliminado', 'success');
          this.loadMethods();
        },
        error: () => this.uiService.showToast('Error al eliminar', 'error')
      });
    }
  }
}