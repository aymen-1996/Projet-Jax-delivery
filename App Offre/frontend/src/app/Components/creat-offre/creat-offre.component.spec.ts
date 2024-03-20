import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatOffreComponent } from './creat-offre.component';

describe('CreatOffreComponent', () => {
  let component: CreatOffreComponent;
  let fixture: ComponentFixture<CreatOffreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatOffreComponent]
    });
    fixture = TestBed.createComponent(CreatOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
