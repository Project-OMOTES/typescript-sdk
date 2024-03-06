import { Job } from './Job';
import { getCancelQueue, getProgressQueue, getResultQueue, getStatusQueue, getSubmissionQueue } from './queue';

describe('Queue functions', () => {
  const mockJob = { uuid: 'foo' } as unknown as Job;
  const mockType = 'grow_simulator';

  it('getSubmissionQueue returns correct queue name', () => {
    const result = getSubmissionQueue(mockType);
    expect(result).toEqual(`job_submissions.grow_simulator`);
  });

  it('getProgressQueue returns correct queue name', () => {
    const result = getProgressQueue(mockJob);
    expect(result).toEqual(`jobs.foo.progress`);
  });

  it('getResultsQueue returns correct queue name', () => {
    const result = getResultQueue(mockJob);
    expect(result).toEqual(`jobs.foo.result`);
  });

  it('getStatusQueue returns correct queue name', () => {
    const result = getStatusQueue(mockJob);
    expect(result).toEqual(`jobs.foo.status`);
  });

  it('getCancelQueue returns correct queue name', () => {
    const result = getCancelQueue(mockJob);
    expect(result).toEqual(`jobs.foo.cancel`);
  });
});