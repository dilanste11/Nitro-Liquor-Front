import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout-success.component.html'
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  orderId: string = '';

  ngOnInit() {
    // Leemos el ID del pedido de la URL (ej: /checkout/success/45)
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
  }
}