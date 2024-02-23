import { Job } from './Job';
import { JobTypeName } from './types';

export function getSubmissionQueue(forType: JobTypeName) {
  return `job_submissions.${forType}`;
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

export function getCancelQueue(job: Job) {
  return `jobs.${job.uuid}.cancel`;
}
