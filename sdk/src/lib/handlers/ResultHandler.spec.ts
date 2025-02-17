import { JobResult } from '@omotes/proto';
import { Channel, Connection } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel, MockConnection } from '../../util/MockChannel.spec';
import { Job } from '../Job';
import { ResultHandler } from './ResultHandler';

describe('ResultsHandler', () => {
  describe('#getResult', () => {
    let job: Job;
    let channel: MockChannel<JobResult>;
    let connection: MockConnection;
    let handler: ResultHandler;

    beforeEach(() => {
      channel = new MockChannel();
      connection = new MockConnection();
      job = new Job('grow_simulator', 'esdl', connection as unknown as Connection, channel as unknown as Channel);
      handler = new ResultHandler(
        job,
        of(channel as unknown as Channel)
      );
    });

    it('should report result', (done) => {
      handler.getResult().subscribe((result) => {
        expect(result).toEqual({
          uuid: 'uuid',
          logs: 'logs',
          outputEsdl: 'output_esdl',
          resultType: JobResult.ResultType.SUCCEEDED,
          esdlMessagesList: [],
        });
        done();
      });
      const message = new JobResult();
      message.setUuid('uuid');
      message.setLogs('logs');
      message.setOutputEsdl('output_esdl');
      message.setResultType(JobResult.ResultType.SUCCEEDED);
      message.setEsdlMessagesList([]);
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
      message.setEsdlMessagesList([]);
      channel.pushMessage(message);
    })
  });
});