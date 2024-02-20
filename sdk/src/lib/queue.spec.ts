import { Job } from './Job';
import { getProgressQueue, getResultsQueue, getStatusQueue, getSubmissionQueue } from './queue';

describe('Queue functions', () => {
  const mockJob = new Job('grow_simulator', 'esdl');
  const mockType = 'grow_simulator';

  test('getSubmissionQueue returns correct queue name', () => {
    const result = getSubmissionQueue(mockType);
    expect(result).toEqual(`job_submissions.${mockType}`);
  });

  test('getProgressQueue returns correct queue name', () => {
    const result = getProgressQueue(mockJob);
    expect(result).toEqual(`jobs.${mockJob.uuid}.progress`);
  });

  test('getResultsQueue returns correct queue name', () => {
    const result = getResultsQueue(mockJob);
    expect(result).toEqual(`jobs.${mockJob.uuid}.results`);
  });

  test('getStatusQueue returns correct queue name', () => {
    const result = getStatusQueue(mockJob);
    expect(result).toEqual(`jobs.${mockJob.uuid}.status`);
  });
});