import { TestBed, async, inject } from '@angular/core/testing';

import { HrGuard } from './hr.guard';

describe('HrGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HrGuard]
    });
  });

  it('should ...', inject([HrGuard], (guard: HrGuard) => {
    expect(guard).toBeTruthy();
  }));
});
