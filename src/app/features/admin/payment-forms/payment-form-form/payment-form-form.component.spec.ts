import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFormFormComponent } from './payment-form-form.component';

describe('PaymentFormFormComponent', () => {
  let component: PaymentFormFormComponent;
  let fixture: ComponentFixture<PaymentFormFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFormFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentFormFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
