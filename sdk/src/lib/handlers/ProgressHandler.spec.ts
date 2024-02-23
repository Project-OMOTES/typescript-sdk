import { JobProgressUpdate } from '@omotes/proto';
import { Channel, Connection } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel, MockConnection } from '../../util/MockChannel.spec';
import { Job } from '../Job';
import { ProgressHandler } from './ProgressHandler';

describe('ProgressHandler', () => {
  let job: Job;
  let channel: MockChannel<JobProgressUpdate>;
  let connection: MockConnection;
  let handler: ProgressHandler;

  beforeEach(() => {
    connection = new MockConnection();
    channel = new MockChannel();
    job = new Job('grow_simulator', 'esdl', connection as unknown as Connection, channel as unknown as Channel);
    handler = new ProgressHandler(job, of(channel as unknown as Channel));
  });

  describe('#getProgress', () => {
    it('should report progress', (done) => {
      const progressValues = [0.1, 0.2, 0.3, 0.4, 0.5, 1];
      const values: number[] = [];
      handler.getProgress().subscribe({
        next: (value) => values.push(value),
        complete: () => {
          expect(values).toEqual([0.1, 0.2, 0.3, 0.4, 0.5, 1]);
          done();
        }
      });
      for (const progress of progressValues) {
        const message = new JobProgressUpdate();
        message.setProgress(progress);
        channel.pushMessage(message);
      }
      handler.close();
    });
  });
});