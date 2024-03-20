import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavebagComponent } from './savebag.component';

describe('SavebagComponent', () => {
  let component: SavebagComponent;
  let fixture: ComponentFixture<SavebagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavebagComponent]
    });
    fixture = TestBed.createComponent(SavebagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
