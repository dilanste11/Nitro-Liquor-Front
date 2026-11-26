import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalUiComponent } from './global-ui.component';

describe('GlobalUiComponent', () => {
  let component: GlobalUiComponent;
  let fixture: ComponentFixture<GlobalUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
