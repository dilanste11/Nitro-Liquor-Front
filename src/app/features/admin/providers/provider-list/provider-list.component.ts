import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProviderService } from '../../../../core/services/provider/provider.service';
import { ProviderDTO } from '../../../../models/provider/provider.dto';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './provider-list.component.html'
})
export class ProviderListComponent implements OnInit {
  private providerService = inject(ProviderService);
  
  providers: ProviderDTO[] = [];
  isLoading = true;

  ngOnInit() { 
    this.loadProviders(); 
  }

  loadProviders() {
    this.providerService.getProviders().subscribe({
      next: (data) => {
        this.providers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar proveedores', err);
        this.isLoading = false;
      }
    });
  }

  deleteProvider(id: number) {
    if(confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.providerService.deleteProvider(id).subscribe({
        next: () => this.loadProviders(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }
}