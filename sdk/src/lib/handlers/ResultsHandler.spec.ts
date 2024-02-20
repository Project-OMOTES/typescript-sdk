import { JobResult } from '@omotes/proto';
import { Channel } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel } from '../../util/MockChannel.spec';
import { Job } from '../Job';
import { ResultsHandler } from './ResultsHandler';

describe('ResultsHandler', () => {
  describe('constructor', () => {
    it('should create', () => {
      const handler = new ResultsHandler(
        new Job('grow_simulator', 'esdl'),
        of(new MockChannel() as unknown as Channel)
      );
      expect(handler).toBeDefined();
    });
  });

  describe('#getResult', () => {
    let job: Job;
    let channel: MockChannel<JobResult>;
    let handler: ResultsHandler;

    beforeEach(() => {
      job = new Job('grow_simulator', 'esdl');
      channel = new MockChannel();
      handler = new ResultsHandler(
        job,
        of(channel as unknown as Channel)
      );
    });

    it('should report result', (done) => {
      handler.getResult().subscribe((result) => {
        expect(result).toEqual({
          uuid: 'uuid',
          logs: 'logs',
          outputEsdl: Buffer.from('output_esdl').toString('base64'),
          resultType: JobResult.ResultType.SUCCEEDED
        });
        done();
      });
      const message = new JobResult();
      message.setUuid('uuid');
      message.setLogs('logs');
      const encoder = new TextEncoder();
      message.setOutputEsdl(encoder.encode('output_esdl'));
      message.setResultType(JobResult.ResultType.SUCCEEDED);
      channel.pushMessage(message);
    });

    it('should error when not succeeded', (done) => {
      handler.getResult().subscribe({
        next: () => {
          done.fail('Should not have succeeded');
        },
        error: (error) => {
          expect(error.message).toEqual('Job uuid failed: logs');
          done();
        },
        complete: () => {
          done.fail('Should not have completed');
        }
      });
      const message = new JobResult();
      message.setUuid('uuid');
      message.setLogs('logs');
      message.setResultType(JobResult.ResultType.ERROR);
      channel.pushMessage(message);
    })
  });
});