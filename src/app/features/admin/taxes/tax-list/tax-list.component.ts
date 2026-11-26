import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaxService } from '../../../../core/services/tax/tax.service';
import { TaxDTO } from '../../../../models/tax/tax.dto';

@Component({
  selector: 'app-tax-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tax-list.component.html'
})
export class TaxListComponent implements OnInit {
  private taxService = inject(TaxService);
  
  taxes: TaxDTO[] = [];
  isLoading = true;

  ngOnInit() { 
    this.loadTaxes(); 
  }

  loadTaxes() {
    this.taxService.getTaxes().subscribe({
      next: (data) => {
        this.taxes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar impuestos', err);
        this.isLoading = false;
      }
    });
  }

  deleteTax(id: number) {
    if(confirm('¿Estás seguro de eliminar este impuesto?')) {
      this.taxService.deleteTax(id).subscribe({
        next: () => this.loadTaxes(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }
}