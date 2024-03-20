import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormperformanceComponent } from './formperformance.component';

describe('FormperformanceComponent', () => {
  let component: FormperformanceComponent;
  let fixture: ComponentFixture<FormperformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormperformanceComponent]
    });
    fixture = TestBed.createComponent(FormperformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
