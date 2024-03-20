import { TestBed } from '@angular/core/testing';

import { SavebagService } from './savebag.service';

describe('SavebagService', () => {
  let service: SavebagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavebagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
