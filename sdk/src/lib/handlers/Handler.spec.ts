import { JobSubmission } from '@omotes/proto';
import { Channel, Connection } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel, MockConnection } from '../../util/MockChannel.spec';
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
  let connection: MockConnection;

  beforeEach(() => {
    channel = new MockChannel();
    connection = new MockConnection();
    job = new Job('grow_simulator', 'esdl', connection as unknown as Connection, channel as unknown as Channel);
    handler = new ConcreteHandler(job, of(channel as unknown as Channel));
  });

  it('should ack messages', () => {
    handler.getStream().subscribe();
    const message = new JobSubmission();
    channel.pushMessage(message);
    channel.pushMessage(message);
    expect(channel.ack).toHaveBeenCalledTimes(2);
  });

  it('should delete queue unsubscribing', () => {
    handler.getStream().subscribe().unsubscribe();
    expect(channel.deleteQueue).toHaveBeenCalled();
  });

  it('should delete queue when calling #close', () => {
    handler.getStream().subscribe();
    handler.close();
    expect(channel.deleteQueue).toHaveBeenCalled();
  });
});