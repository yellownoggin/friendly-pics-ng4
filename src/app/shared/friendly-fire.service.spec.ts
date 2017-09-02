import { TestBed, inject } from '@angular/core/testing';

import { FriendlyFireService } from './friendly-fire.service';

describe('FriendlyFireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendlyFireService]
    });
  });

  it('should be created', inject([FriendlyFireService], (service: FriendlyFireService) => {
    expect(service).toBeTruthy();
  }));
});
