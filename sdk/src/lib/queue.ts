import { Job } from './Job';

export function getSubmissionsQueue() {
  return `job_submissions`;
}

export function getProgressQueue(job: Job) {
  return `jobs.${job.uuid}.progress`;
}

export function getResultQueue(job: Job) {
  return `jobs.${job.uuid}.result`;
}

export function getStatusQueue(job: Job) {
  return `jobs.${job.uuid}.status`;
}

export function getCancellationsQueue() {
  return `job_deletions`;
}
