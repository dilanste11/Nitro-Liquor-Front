import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AddressService } from '../../../core/services/address/address.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UiService } from '../../../core/services/ui/ui.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addresses.component.html'
})
export class AddressesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private authService = inject(AuthService);
  private uiService = inject(UiService);

  addresses: any[] = [];
  showForm = false;
  isLoading = false;
  userId: number = 0;

  // Formulario reactivo que hace match con tu UserAddressCreateDTO
  addressForm: FormGroup = this.fb.group({
    type: ['CASA', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['Colombia', Validators.required],
    phone: ['', Validators.required]
  });

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (this.userId > 0) {
      this.loadAddresses();
    }
  }

  loadAddresses() {
    this.addressService.getAddressesByUserId(this.userId).subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: () => this.uiService.showToast('Error al cargar la libreta de direcciones', 'error')
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.addressForm.reset({ type: 'CASA', country: 'Colombia' });
    }
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    // Inyectamos el UserId al objeto del formulario antes de enviarlo a C#
    const payload = {
      ...this.addressForm.value,
      userId: this.userId
    };

    this.addressService.createAddress(payload).subscribe({
      next: () => {
        this.uiService.showToast('Dirección agregada con éxito', 'success');
        this.loadAddresses();
        this.toggleForm();
        this.isLoading = false;
      },
      error: (err) => {
        this.uiService.showToast('Error al guardar la dirección', 'error');
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}