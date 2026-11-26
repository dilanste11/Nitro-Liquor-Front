import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShippingMethodService } from '../../../../core/services/shipping-method/shipping-method.service';
import { UiService } from '../../../../core/services/ui/ui.service';

@Component({
  selector: 'app-shipping-method-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './shipping-method-form.component.html'
})
export class ShippingMethodFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private shippingService = inject(ShippingMethodService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private uiService = inject(UiService);

  shippingForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    isActive: [true] // Checkbox booleano
  });

  isEditMode = false;
  methodId: number | null = null;
  isSaving = false;

  ngOnInit() {
    this.methodId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.methodId) {
      this.isEditMode = true;
      this.loadMethodData();
    }
  }

  loadMethodData() {
    this.shippingService.getById(this.methodId!).subscribe({
      next: (data) => this.shippingForm.patchValue(data),
      error: () => {
        this.uiService.showToast('Error al cargar los datos', 'error');
        this.router.navigate(['/admin/shipping-methods']);
      }
    });
  }

  onSubmit() {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.shippingForm.value;

    const request$ = this.isEditMode 
      ? this.shippingService.update(this.methodId!, payload)
      : this.shippingService.create(payload);

    request$.subscribe({
      next: () => {
        this.uiService.showToast(`Método ${this.isEditMode ? 'actualizado' : 'creado'} exitosamente`, 'success');
        this.router.navigate(['/admin/shipping-methods']);
      },
      error: () => {
        this.uiService.showToast('Error al guardar el método', 'error');
        this.isSaving = false;
      }
    });
  }
}