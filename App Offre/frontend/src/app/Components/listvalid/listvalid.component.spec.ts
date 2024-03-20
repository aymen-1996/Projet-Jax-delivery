import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListvalidComponent } from './listvalid.component';

describe('ListvalidComponent', () => {
  let component: ListvalidComponent;
  let fixture: ComponentFixture<ListvalidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListvalidComponent]
    });
    fixture = TestBed.createComponent(ListvalidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
