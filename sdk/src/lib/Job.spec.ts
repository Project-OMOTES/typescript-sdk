import { JobSubmission } from '@omotes/proto';
import { Job } from './Job';

describe('Job', () => {
  it('should have a uuid', () => {
    const job = new Job('grow_simulator', 'esdl');
    expect(job.uuid).toBeDefined();
  });

  it('should have correct type', () => {
    const job = new Job('grow_simulator', 'esdl');
    expect(job.type).toBe('grow_simulator');
  });

  describe('#toBuffer', () => {
    const job = new Job('grow_optimizer', 'esdl');
    const buffer = job.toBuffer();
    const submission = JobSubmission.deserializeBinary(buffer);
    expect(submission.toObject()).toEqual({
      uuid: job.uuid,
      timeoutMs: 0,
      workflowType: 'grow_optimizer',
      esdl: 'esdl',
    });
  });
});
