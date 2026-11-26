import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentFormService } from '../../../../core/services/payment-form/payment-form.service';
import { PaymentFormDTO } from '../../../../models/payment/payment-form.dto';

@Component({
  selector: 'app-payment-form-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './payment-form-form.component.html'
})
export class PaymentFormFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentFormService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formId: number | null = null;
  isEditMode = false;
  isLoading = false;

  paymentForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    visibility: ['PUBLIC'],
    isActive: [true]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formId = Number(id);
      this.isEditMode = true;
      this.paymentService.getPaymentFormById(this.formId).subscribe({
        next: (data) => this.paymentForm.patchValue({
          name: data.name,
          description: data.description,
          visibility: data.visibility,
          isActive: data.isActive
        }),
        error: (err) => console.error(err)
      });
    }
  }

  onSubmit() {
    if (this.paymentForm.invalid) return;
    this.isLoading = true;
    const formData = this.paymentForm.value as Partial<PaymentFormDTO>;

    const request = this.isEditMode && this.formId
      ? this.paymentService.updatePaymentForm(this.formId, formData)
      : this.paymentService.createPaymentForm(formData);

    request.subscribe({
      next: () => this.router.navigate(['/admin/payment-forms']),
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }
}