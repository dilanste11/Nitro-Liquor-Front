import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFormListComponent } from './payment-form-list.component';

describe('PaymentFormListComponent', () => {
  let component: PaymentFormListComponent;
  let fixture: ComponentFixture<PaymentFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFormListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
