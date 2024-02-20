import { JobSubmission } from '@omotes/proto';
import { Channel } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel } from '../../util/MockChannel.spec';
import { Job } from '../Job';
import { Handler } from './Handler';

class ConcreteHandler extends Handler {
  protected override queue = 'foo1';
  getStream() {
    return this.channelToRx();
  }
}

describe('Handler', () => {
  let handler: ConcreteHandler;
  let job: Job;
  let channel: MockChannel<JobSubmission>;

  beforeEach(() => {
    job = new Job('grow_simulator', 'esdl');
    channel = new MockChannel();
    handler = new ConcreteHandler(job, of(channel as unknown as Channel));
  });

  it('should ack messages', () => {
    handler.getStream().subscribe();
    const message = new JobSubmission();
    channel.pushMessage(message);
    channel.pushMessage(message);
    expect(channel.ack).toHaveBeenCalledTimes(2);
  });

  it('should close channel when unsubscribing', () => {
    handler.getStream().subscribe().unsubscribe();
    expect(channel.close).toHaveBeenCalled();
  });

  it('should close', () => {
    handler.getStream().subscribe();
    handler.close();
    expect(channel.close).toHaveBeenCalled();
  });
});