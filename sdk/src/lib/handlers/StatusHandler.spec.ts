import { JobStatusUpdate } from '@omotes/proto';
import { Channel, Connection } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel, MockConnection } from '../../util/MockChannel.spec';
import { Job } from '../Job';
import { StatusHandler } from './StatusHandler';

describe('StatusHandler', () => {
  let job: Job;
  let channel: MockChannel<JobStatusUpdate>;
  let connection: MockConnection;
  let handler: StatusHandler;

  beforeEach(() => {
    channel = new MockChannel();
    connection = new MockConnection();
    job = new Job('grow_simulator', 'esdl', connection as unknown as Connection, channel as unknown as Channel);
    handler = new StatusHandler(
      job,
      of(channel as unknown as Channel)
    );
  });

  describe('#getStatus', () => {
    for (const status of Object.values(JobStatusUpdate.JobStatus)) {
      it(`should report ${status}`, (done) => {
        handler.getStatus().subscribe((status) => {
          expect(status).toEqual(status);
          done();
        });
        const message = new JobStatusUpdate();
        message.setStatus(status);
        channel.pushMessage(message);
      });
    }
  });
});