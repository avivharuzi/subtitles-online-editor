import { TestBed } from '@angular/core/testing';

import { SubtitleService } from './subtitle.service';

describe('SubtitleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubtitleService = TestBed.inject(SubtitleService);
    expect(service).toBeTruthy();
  });
});
