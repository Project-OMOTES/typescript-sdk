import { Job } from './Job';
import { JobTypeName } from './types';

/**
 * Returns appropriate queue name for job submissions, progress, results, and status.
 */
export class QueueManager {
  public getSubmissionQueue(forType: JobTypeName) {
    return `job_submissions.${forType}`;
  }

  public getProgressQueue(job: Job) {
    return `jobs.${job.uuid}.progress`;
  }

  public getResultsQueue(job: Job) {
    return `jobs.${job.uuid}.results`;
  }

  public getStatusQueue(job: Job) {
    return `jobs.${job.uuid}.status`;
  }
}