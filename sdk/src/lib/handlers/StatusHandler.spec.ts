import { JobStatusUpdate } from '@omotes/proto';
import { Channel } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel } from '../../util/MockChannel.spec';
import { Job } from '../Job';
import { StatusHandler } from './StatusHandler';

describe('StatusHandler', () => {
  describe('constructor', () => {
    it('should create', () => {
      const handler = new StatusHandler(
        new Job('grow_simulator', 'esdl'),
        of(new MockChannel() as unknown as Channel)
      );
      expect(handler).toBeDefined();
    });
  });

  describe('#getStatus', () => {
    let job: Job;
    let channel: MockChannel<JobStatusUpdate>;
    let handler: StatusHandler;

    beforeEach(() => {
      job = new Job('grow_simulator', 'esdl');
      channel = new MockChannel();
      handler = new StatusHandler(
        job,
        of(channel as unknown as Channel)
      );
    });

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