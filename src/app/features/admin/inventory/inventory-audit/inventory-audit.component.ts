import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product/product.service';
import { MovementService } from '../../../../core/services/movement/movement.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MovementCreateDTO } from '../../../../models/movement/movement-create.dto';

interface AuditItem {
  product: any; // Aquí usa tu ProductDTO
  systemStock: number;
  realStock: number;
  difference: number;
}

@Component({
  selector: 'app-inventory-audit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './inventory-audit.component.html'
})
export class InventoryAuditComponent implements OnInit {
  private productService = inject(ProductService);
  private movementService = inject(MovementService);
  private authService = inject(AuthService);
  
  products: any[] = []; // Tu ProductDTO[]
  auditList: AuditItem[] = [];
  selectedProductId: number | null = null;
  
  auditNote = '';
  isLoading = false;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Asumiendo que tu ProductService tiene un getProducts()
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  addProductToAudit() {
    if (!this.selectedProductId) return;
    
    // Evitar duplicados en la lista
    if (this.auditList.find(i => i.product.id == this.selectedProductId)) return;

    const prod = this.products.find(p => p.id == this.selectedProductId);
    if (prod) {
      this.auditList.push({
        product: prod,
        systemStock: prod.quantity || 0,
        realStock: prod.quantity || 0,
        difference: 0
      });
      this.selectedProductId = null; // Limpiar select
    }
  }

  updateDifference(item: AuditItem) {
    // Calcula la diferencia (Ej: Físico 8 - Sistema 10 = -2)
    item.difference = item.realStock - item.systemStock;
  }

  removeItem(index: number) {
    this.auditList.splice(index, 1);
  }

  onSubmit() {
    if (this.auditList.length === 0) {
      alert('Debes agregar al menos un producto para auditar.');
      return;
    }
    if (!this.auditNote) {
      alert('Debes ingresar un motivo o nota para la auditoría.');
      return;
    }

    this.isLoading = true;
    const now = new Date().toISOString();

   const responsible = this.authService.getUserId();
    console.log('ID del usuario responsable:', responsible); // Para verificar que no sea 0

    const movement: MovementCreateDTO = {
      orderNumber: `AUDIT-${Date.now()}`,
      orderDate: now,
      paymentDate: now,
      type: 'AUDITORIA',
      note: this.auditNote,
      total: 0,
      responsibleId: responsible, 
      paymentFormId: 1, // <--- OJO: Cambia este 1 si tu forma de pago tiene otro ID en la tabla
      shippingMethodId: null, // <--- CAMBIADO A NULL
      status: 1,
      details: this.auditList.map(item => ({
        productId: item.product.id,
        quantity: item.difference, 
        subtotal: 0
      }))
    };
    
    console.log('Enviando a C#:', movement);

    this.movementService.createMovement(movement).subscribe({
      next: () => {
        alert('Auditoría registrada y stock actualizado con éxito.');
        this.auditList = [];
        this.auditNote = '';
        this.loadProducts(); // Recargar productos para ver el nuevo stock
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al registrar la auditoría.');
        this.isLoading = false;
      }
    });
  }
}