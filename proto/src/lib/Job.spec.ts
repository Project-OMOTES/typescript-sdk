import { JobSubmission } from './generated/src/lib/proto/job_pb';

describe('Job', () => {
  describe('JobSubmission', () => {
    it('should work', () => {
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
  });
});