import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAllComponent } from './save-all.component';

describe('SaveAllComponent', () => {
  let component: SaveAllComponent;
  let fixture: ComponentFixture<SaveAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveAllComponent]
    });
    fixture = TestBed.createComponent(SaveAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
