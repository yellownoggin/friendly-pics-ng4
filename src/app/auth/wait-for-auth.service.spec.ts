import { TestBed, inject } from '@angular/core/testing';

import { WaitForAuthService } from './wait-for-auth.service';

describe('WaitForAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WaitForAuthService]
    });
  });

  it('should be created', inject([WaitForAuthService], (service: WaitForAuthService) => {
    expect(service).toBeTruthy();
  }));
});
