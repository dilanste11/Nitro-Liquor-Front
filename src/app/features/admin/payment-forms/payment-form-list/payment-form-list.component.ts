import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaymentFormService } from '../../../../core/services/payment-form/payment-form.service';
import { PaymentFormDTO } from '../../../../models/payment/payment-form.dto';

@Component({
  selector: 'app-payment-form-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-form-list.component.html'
})
export class PaymentFormListComponent implements OnInit {
  private paymentService = inject(PaymentFormService);
  
  paymentForms: PaymentFormDTO[] = [];
  isLoading = true;

  ngOnInit() { this.loadPaymentForms(); }

  loadPaymentForms() {
    this.paymentService.getPaymentForms().subscribe({
      next: (data) => {
        this.paymentForms = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar formas de pago', err);
        this.isLoading = false;
      }
    });
  }

  deletePaymentForm(id: number) {
    if(confirm('¿Estás seguro de eliminar esta forma de pago? Si tiene movimientos asociados, podría dar error.')) {
      this.paymentService.deletePaymentForm(id).subscribe({
        next: () => this.loadPaymentForms(),
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('No se pudo eliminar. Es posible que esté en uso en algún movimiento o auditoría.');
        }
      });
    }
  }
}