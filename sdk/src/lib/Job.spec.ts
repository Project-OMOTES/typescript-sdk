import { Job } from './Job';

describe('Job', () => {
  it('should have a uuid', () => {
    const job = new Job('grow_simulator');
    expect(job.uuid).toBeDefined();
  });
});
