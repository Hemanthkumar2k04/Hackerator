import { TestBed } from '@angular/core/testing';

import { SendpromptService } from './sendprompt.service';

describe('SendpromptService', () => {
  let service: SendpromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendpromptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
