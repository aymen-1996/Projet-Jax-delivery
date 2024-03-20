import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSavebagComponent } from './form-savebag.component';

describe('FormSavebagComponent', () => {
  let component: FormSavebagComponent;
  let fixture: ComponentFixture<FormSavebagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormSavebagComponent]
    });
    fixture = TestBed.createComponent(FormSavebagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
