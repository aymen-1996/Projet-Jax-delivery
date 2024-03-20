import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstOffreComponent } from './const-offre.component';

describe('ConstOffreComponent', () => {
  let component: ConstOffreComponent;
  let fixture: ComponentFixture<ConstOffreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstOffreComponent]
    });
    fixture = TestBed.createComponent(ConstOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
