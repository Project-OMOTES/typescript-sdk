import { JobDelete, JobSubmission } from '@omotes/proto';
import { Channel, Connection } from 'amqplib';
import { MockChannel, MockConnection } from '../util/MockChannel.spec';
import { Job } from './Job';
import { ProgressHandler } from './handlers/ProgressHandler';
import { ResultHandler } from './handlers/ResultHandler';
import { StatusHandler } from './handlers/StatusHandler';

describe('Job', () => {
  let job: Job;
  let channel: MockChannel<JobSubmission>;
  let connection: MockConnection;

  beforeEach(() => {
    channel = new MockChannel();
    connection = new MockConnection();
    job = new Job('grow_simulator', 'esdl', connection as unknown as Connection, channel as unknown as Channel);
  });

  describe('#start', () => {
    it('should send job submission', () => {
      job.start();
      expect(channel.sendToQueue).toHaveBeenCalledWith('job_submissions', expect.any(Buffer), { persistent: true });
      const submission = channel.sendToQueue.mock.calls[0][1];
      const message = JobSubmission.deserializeBinary(submission);
      expect(message.toObject()).toEqual(expect.objectContaining({
        workflowType: 'grow_simulator',
        esdl: 'esdl'
      }));
    });
  });

  describe('#cancel', () => {
    it('should send job cancel', () => {
      job.delete();
      expect(channel.sendToQueue).toHaveBeenCalledWith('job_deletions', expect.any(Buffer), { persistent: true });
      const submission = channel.sendToQueue.mock.calls[0][1];
      const message = JobDelete.deserializeBinary(submission);
      expect(message.toObject()).toEqual(expect.objectContaining({
        uuid: job.uuid
      }));
    });
  });

  describe('#getProgressHandler', () => {
    it('should return progress handler', () => {
      const handler = job.getProgressHandler();
      expect(handler).toBeInstanceOf(ProgressHandler);
    });
  });

  describe('#getStatusHandler', () => {
    it('should return status handler', () => {
      const handler = job.getStatusHandler();
      expect(handler).toBeInstanceOf(StatusHandler);
    });
  });

  describe('#getResultHandler', () => {
    it('should return result handler', () => {
      const handler = job.getResultHandler();
      expect(handler).toBeInstanceOf(ResultHandler);
    });
  });

  describe('params and job reference', () => {
    it('should correctly set params', () => {
      job.setParams({ foo: 'bar', baz: 42 });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const struct = getSubmissionFromJob(job).getParamsDict()!;
      expect(struct.toJavaScript()).toEqual({ foo: 'bar', baz: 42 });
    });

    it('should correctly set date params', () => {
      const date = new Date(123456789);
      job.setParams({ date });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const struct = getSubmissionFromJob(job).getParamsDict()!;
      expect(struct.toJavaScript()).toEqual({ date: 123456.789 });
    });

    it('should correctly set job reference', () => {
      job.setJobReference('job_reference');
      expect(getSubmissionFromJob(job).getJobReference()).toBe('job_reference');
    });

    it('should allow chained method calls', () => {
      expect(() => job.setParams({}).setJobReference('')).not.toThrow();
    });
  });

  describe('timeout', () => {
    it('should default to two hours', () => {
      expect(getSubmissionFromJob(job).getTimeoutMs()).toBe(1000 * 60 * 60 * 2);
    });
  });
});

function getSubmissionFromJob(job: Job) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (job as any).jobSubmission as JobSubmission;
}
