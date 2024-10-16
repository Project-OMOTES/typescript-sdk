import { JobSubmission } from '@omotes/proto';
import { Channel } from 'amqplib';
import { of } from 'rxjs';
import { MockChannel } from '../../util/MockChannel.spec';
import { Handler } from './Handler';

class ConcreteHandler extends Handler {
  protected override queue = 'foo1';
  getStream() {
    return this.channelToRx();
  }
}

describe('Handler', () => {
  let handler: ConcreteHandler;
  let channel: MockChannel<JobSubmission>;

  beforeEach(() => {
    channel = new MockChannel();
    handler = new ConcreteHandler(of(channel as unknown as Channel));
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