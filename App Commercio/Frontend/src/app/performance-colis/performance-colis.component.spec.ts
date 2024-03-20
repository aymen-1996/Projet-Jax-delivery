import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceColisComponent } from './performance-colis.component';

describe('PerformanceColisComponent', () => {
  let component: PerformanceColisComponent;
  let fixture: ComponentFixture<PerformanceColisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceColisComponent]
    });
    fixture = TestBed.createComponent(PerformanceColisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
