import { Job } from './Job';
import { getCancellationsQueue, getProgressQueue, getResultQueue, getStatusQueue, getSubmissionsQueue } from './queue';

describe('Queue functions', () => {
  const mockJob = { uuid: 'foo' } as unknown as Job;

  it('getSubmissionQueue returns correct queue name', () => {
    const result = getSubmissionsQueue();
    expect(result).toEqual(`job_submissions`);
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
    const result = getCancellationsQueue();
    expect(result).toEqual(`job_cancellations`);
  });
});