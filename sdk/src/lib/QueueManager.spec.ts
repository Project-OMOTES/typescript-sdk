import { Job } from './Job';
import { QueueManager } from './QueueManager';

describe('QueueManager', () => {
  let queueManager: QueueManager;

  beforeEach(() => {
    queueManager = new QueueManager();
  });

  it('should return the correct submission queue', () => {
    const forType = 'grow_simulator';
    const expectedQueue = 'job_submissions.grow_simulator';
    const submissionQueue = queueManager.getSubmissionQueue(forType);
    expect(submissionQueue).toBe(expectedQueue);
  });

  it('should return the correct progress queue', () => {
    const job = new Job('grow_simulator');
    const expectedQueue = `jobs.${job.uuid}.progress`;
    const progressQueue = queueManager.getProgressQueue(job);
    expect(progressQueue).toBe(expectedQueue);
  });

  it('should return the correct results queue', () => {
    const job = new Job('grow_simulator');
    const expectedQueue = `jobs.${job.uuid}.results`;
    const resultsQueue = queueManager.getResultsQueue(job);
    expect(resultsQueue).toBe(expectedQueue);
  });

  it('should return the correct status queue', () => {
    const job = new Job('grow_simulator');
    const expectedQueue = `jobs.${job.uuid}.status`;
    const statusQueue = queueManager.getStatusQueue(job);
    expect(statusQueue).toBe(expectedQueue);
  });
});