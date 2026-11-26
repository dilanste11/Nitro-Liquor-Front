import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product/product.service';
import { CategoryService } from '../../../../core/services/category/category.service';
import { ProviderService } from '../../../../core/services/provider/provider.service';
import { CategoryDTO } from '../../../../models/category/category.dto';
import { ProviderDTO } from '../../../../models/provider/provider.dto';
import { TaxService } from '../../../../core/services/tax/tax.service';
import { TaxDTO } from '../../../../models/tax/tax.dto';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  // 1. Inyecciones de dependencias
  private categoryService = inject(CategoryService);
  private providerService = inject(ProviderService);
  private taxService = inject(TaxService);
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 2. Variables de estado del componente
  productId: number | null = null;
  isEditMode = false;
  isLoading = false;
  selectedFile: File | null = null; 

  // Listas para los selects
  categories: CategoryDTO[] = [];
  providers: ProviderDTO[] = [];
  taxes: TaxDTO[] = [];

  // 3. Declaración del formulario
productForm = this.fb.group({
    reference: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    pricePurchase: [0, [Validators.required, Validators.min(0)]],
    priceSale: [0, [Validators.required, Validators.min(1)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    stockMinimum: [0, [Validators.required, Validators.min(0)]],
    stockMaximum: [0, [Validators.required, Validators.min(0)]],
    productCategoryId: [null, Validators.required],
    supplierId: [null, Validators.required],
    productTaxId: [null, Validators.required]
  }, { validators: this.stockRangeValidator });

  stockRangeValidator(group: AbstractControl): ValidationErrors | null {
    const min = Number(group.get('stockMinimum')?.value ?? 0);
    const max = Number(group.get('stockMaximum')?.value ?? 0);
    return max > 0 && max < min ? { invalidStockRange: true } : null;
  }
  // 4. Único ciclo de vida OnInit (Se unificaron los dos que tenías)
  ngOnInit() {
    this.loadDropdowns(); 

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = Number(idParam);
      this.isEditMode = true;
      this.loadProductData();
    }
  }

  // 5. Métodos personalizados
  loadDropdowns() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error cargando categorías', err)
    });

    this.providerService.getProviders().subscribe({
      next: (data) => this.providers = data,
      error: (err) => console.error('Error cargando proveedores', err)
    });
    
    this.taxService.getTaxes().subscribe({
      next: (data) => this.taxes = data,
      error: (err) => console.error('Error cargando impuestos', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

 loadProductData() {
    if (!this.productId) return;
    this.productService.getProductById(this.productId).subscribe({
      next: (product: any) => {
        this.productForm.patchValue({
          reference: product.reference,
          name: product.name,
          description: product.description,
          pricePurchase: product.pricePurchase,
          priceSale: product.priceSale,
          quantity: product.quantity,
          stockMinimum: product.stockMinimum,
          stockMaximum: product.stockMaximum,
          productCategoryId: product.productCategoryId,
          supplierId: product.supplierId,
          productTaxId: product.productTaxId || 1
        });
      },
      error: (err) => console.error('Error al cargar el producto', err)
    });
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    this.isLoading = true;
    const formData = new FormData();
    const formValues = this.productForm.value;

    // Función mágica para evitar enviar textos "null" a C#
    const appendIfExists = (key: string, value: any) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    };

    appendIfExists('Reference', formValues.reference);
    appendIfExists('Name', formValues.name);
    appendIfExists('Description', formValues.description);
    appendIfExists('PricePurchase', formValues.pricePurchase);
    appendIfExists('PriceSale', formValues.priceSale);
    appendIfExists('Quantity', formValues.quantity);
    appendIfExists('StockMinimum', formValues.stockMinimum);
    appendIfExists('StockMaximum', formValues.stockMaximum);
    appendIfExists('ProductCategoryId', formValues.productCategoryId);
    appendIfExists('SupplierId', formValues.supplierId);
    appendIfExists('ProductTaxId', formValues.productTaxId);

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    if (this.isEditMode && this.productId) {
      formData.append('Id', this.productId.toString());
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    }
  }
}