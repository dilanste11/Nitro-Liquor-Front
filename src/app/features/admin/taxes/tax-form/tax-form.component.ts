import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaxService } from '../../../../core/services/tax/tax.service';
import { TaxDTO } from '../../../../models/tax/tax.dto';

@Component({
  selector: 'app-tax-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tax-form.component.html'
})
export class TaxFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taxService = inject(TaxService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taxId: number | null = null;
  isEditMode = false;
  isLoading = false;

  taxForm = this.fb.group({
    name: ['', Validators.required],
    percentage: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taxId = Number(id);
      this.isEditMode = true;
      this.taxService.getTaxById(this.taxId).subscribe({
        next: (tax) => this.taxForm.patchValue({ 
          name: tax.name,
          percentage: tax.percentage
        }),
        error: (err) => console.error('Error cargando el impuesto', err)
      });
    }
  }

  onSubmit() {
    if (this.taxForm.invalid) return;
    this.isLoading = true;

    const taxData: Partial<TaxDTO> = {
      name: String(this.taxForm.value.name),
      percentage: Number(this.taxForm.value.percentage)
    };

    if (this.isEditMode && this.taxId) {
      this.taxService.updateTax(this.taxId, taxData).subscribe({
        next: () => this.router.navigate(['/admin/taxes']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    } else {
      this.taxService.createTax(taxData).subscribe({
        next: () => this.router.navigate(['/admin/taxes']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    }
  }
}