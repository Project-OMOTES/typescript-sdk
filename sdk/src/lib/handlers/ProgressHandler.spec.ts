import { JobProgressUpdate } from '@omotes/proto';
import { Channel } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel } from '../../util/MockChannel.spec';
import { Job } from '../Job';
import { ProgressHandler } from './ProgressHandler';

describe('ProgressHandler', () => {
  describe('constructor', () => {
    it('should create', () => {
      const handler = new ProgressHandler(
        new Job('grow_simulator', 'esdl'),
        of(new MockChannel() as unknown as Channel)
      );
      expect(handler).toBeDefined();
    });
  });

  describe('#getProgress', () => {
    let job: Job;
    let channel: MockChannel<JobProgressUpdate>;
    let handler: ProgressHandler;

    beforeEach(() => {
      job = new Job('grow_simulator', 'esdl');
      channel = new MockChannel();
      handler = new ProgressHandler(
        job,
        of(channel as unknown as Channel)
      );
    });

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

    it('should ack messages', () => {
      handler.getProgress().subscribe();
      const message = new JobProgressUpdate();
      channel.pushMessage(message);
      channel.pushMessage(message);
      expect(channel.ack).toHaveBeenCalledTimes(2);
    });

    it('should close channel when unsubscribing', () => {
      handler.getProgress().subscribe().unsubscribe();
      expect(channel.close).toHaveBeenCalled();
    });
  });

  describe('#close', () => {
    it('should close channel', () => {
      const job = new Job('grow_simulator', 'esdl');
      const channel = new MockChannel();
      const handler = new ProgressHandler(
        job,
        of(channel as unknown as Channel)
      );
      handler.getProgress().subscribe();
      handler.close();
      expect(channel.close).toHaveBeenCalled();
    });
  });
});