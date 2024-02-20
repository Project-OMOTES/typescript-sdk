import { Job } from './Job';
import { JobTypeName } from './types';

export function getSubmissionQueue(forType: JobTypeName) {
  return `job_submissions.${forType}`;
}

export function getProgressQueue(job: Job) {
  return `jobs.${job.uuid}.progress`;
}

export function getResultsQueue(job: Job) {
  return `jobs.${job.uuid}.results`;
}

export function getStatusQueue(job: Job) {
  return `jobs.${job.uuid}.status`;
}
