import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProviderService } from '../../../../core/services/provider/provider.service';
import { ProviderDTO } from '../../../../models/provider/provider.dto';

@Component({
  selector: 'app-provider-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './provider-form.component.html'
})
export class ProviderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private providerService = inject(ProviderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  providerId: number | null = null;
  isEditMode = false;
  isLoading = false;

  providerForm = this.fb.group({
    nit: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.email]], // Es opcional, pero si escriben algo, debe ser un correo válido
    phone1: ['']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.providerId = Number(id);
      this.isEditMode = true;
      this.providerService.getProviderById(this.providerId).subscribe({
        next: (prov) => this.providerForm.patchValue({ 
          nit: prov.nit,
          name: prov.name,
          email: prov.email || '',
          phone1: prov.phone1 || ''
        }),
        error: (err) => console.error('Error cargando el proveedor', err)
      });
    }
  }

  onSubmit() {
    if (this.providerForm.invalid) return;

    this.isLoading = true;
    const formValues = this.providerForm.value;

    const providerData: Partial<ProviderDTO> = {
      nit: String(formValues.nit),
      name: String(formValues.name),
      email: formValues.email ? String(formValues.email) : undefined,
      phone1: formValues.phone1 ? String(formValues.phone1) : undefined
    };

    if (this.isEditMode && this.providerId) {
      this.providerService.updateProvider(this.providerId, providerData).subscribe({
        next: () => this.router.navigate(['/admin/providers']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    } else {
      this.providerService.createProvider(providerData).subscribe({
        next: () => this.router.navigate(['/admin/providers']),
        error: (err) => { console.error(err); this.isLoading = false; }
      });
    }
  }
}