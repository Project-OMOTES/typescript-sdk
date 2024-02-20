import { TaskProgressUpdate, TaskResult } from './Task';

describe('Task', () => {
  describe('TaskProgressUpdate', () => {
    it('should create a correct task progress update', () => {
      const progressUpdate = new TaskProgressUpdate();
      progressUpdate.setJobId('jobId');
      progressUpdate.setProgress(0.5);
      progressUpdate.setMessage('message');
      progressUpdate.setCeleryTaskId('celeryId');
      progressUpdate.setCeleryTaskType('celeryType');
      expect(progressUpdate.toObject()).toEqual({
        jobId: 'jobId',
        progress: 0.5,
        message: 'message',
        celeryTaskId: 'celeryId',
        celeryTaskType: 'celeryType'
      });
      expect(progressUpdate.serializeBinary()).toEqual(expect.any(Uint8Array));
    });
  });

  describe('TaskResult', () => {
    it('should create a correct task result', () => {
      const result = new TaskResult();
      result.setJobId('jobId');
      result.setOutputEsdl('esdl');
      result.setLogs('logs');
      result.setResultType(TaskResult.ResultType.SUCCEEDED);
      expect(result.toObject()).toEqual(expect.objectContaining({
        jobId: 'jobId',
        outputEsdl: 'esdl',
        resultType: TaskResult.ResultType.SUCCEEDED,
        logs: 'logs'
      }));
      expect(result.serializeBinary()).toEqual(expect.any(Uint8Array));
    });
  });
});