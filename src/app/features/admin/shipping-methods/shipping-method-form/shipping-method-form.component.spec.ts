import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingMethodFormComponent } from './shipping-method-form.component';

describe('ShippingMethodFormComponent', () => {
  let component: ShippingMethodFormComponent;
  let fixture: ComponentFixture<ShippingMethodFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingMethodFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingMethodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
