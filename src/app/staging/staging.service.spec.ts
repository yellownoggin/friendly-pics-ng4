import { TestBed, inject } from '@angular/core/testing';

import { StagingService } from './staging.service';

describe('StagingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StagingService]
    });
  });

  it('should be created', inject([StagingService], (service: StagingService) => {
    expect(service).toBeTruthy();
  }));
});
