import { JobProgressUpdate, JobResult, JobStatusUpdate, JobSubmission } from './Job';

describe('Job', () => {
  describe('JobSubmission', () => {
    it('should create a correct job submission', () => {
      const submission = new JobSubmission();
      submission.setUuid('uuid');
      submission.setEsdl('esdl');
      submission.setWorkflowType('workflowType');
      expect(submission.toObject()).toEqual({
        uuid: 'uuid',
        esdl: 'esdl',
        timeoutMs: 0,
        workflowType: 'workflowType',
      });
      expect(submission.serializeBinary()).toEqual(expect.any(Uint8Array));
    });

    it('should deserialize from binary', () => {
      const bytes = new Uint8Array([10, 4, 117, 117, 105, 100, 26,
        12, 119, 111, 114, 107, 102, 108,
        111, 119, 84, 121, 112, 101, 34,
        3, 122, 199, 101]);
      const submission = JobSubmission.deserializeBinary(bytes);
      expect(submission.toObject()).toEqual({
        uuid: 'uuid',
        timeoutMs: 0,
        workflowType: 'workflowType',
        esdl: 'esdl'
      });
    });
  });

  describe('JobResult', () => {
    it('should create a correct job result', () => {
      const result = new JobResult();
      result.setUuid('uuid');
      result.setOutputEsdl('esdl');
      result.setLogs('logs');
      result.setResultType(JobResult.ResultType.SUCCEEDED);
      expect(result.toObject()).toEqual({
        uuid: 'uuid',
        outputEsdl: 'esdl',
        resultType: JobResult.ResultType.SUCCEEDED,
        logs: 'logs'
      });
      expect(result.serializeBinary()).toEqual(expect.any(Uint8Array));
    });
  });

  describe('JobProgressUpdate', () => {
    it('should create a correct job progress update', () => {
      const progressUpdate = new JobProgressUpdate();
      progressUpdate.setUuid('uuid');
      progressUpdate.setProgress(0.5);
      progressUpdate.setMessage('message');
      expect(progressUpdate.toObject()).toEqual({
        uuid: 'uuid',
        progress: 0.5,
        message: 'message'
      });
      expect(progressUpdate.serializeBinary()).toEqual(expect.any(Uint8Array));
    });
  });

  describe('JobStatusUpdate', () => {
    for (const [statusName, status] of Object.entries(JobStatusUpdate.JobStatus)) {
      it(`should create a correct job status update for ${statusName}`, () => {
        const jobStatus = new JobStatusUpdate();
        jobStatus.setStatus(status);
        expect(jobStatus.toObject().status).toEqual(status);
      });
    }
  });
});