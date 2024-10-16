import { RequestAvailableWorkflows } from '@omotes/proto';
import { Channel } from 'amqplib';
import { MockChannel } from '../../util/MockChannel.spec';
import { RequestAvailableWorkflowsHandler } from './RequestAvailableWorkflowsHandler';

describe('RequestAvailableWorkflowsHandler', () => {
  let channel: MockChannel<RequestAvailableWorkflows>;
  let handler: RequestAvailableWorkflowsHandler;
  beforeEach(() => {
    channel = new MockChannel();
    handler = new RequestAvailableWorkflowsHandler();
  });

  describe('#start', () => {
    it('should send a message to the channel', () => {
      handler.start(channel as unknown as Channel);
      expect(channel.sendToQueue).toHaveBeenCalledWith('request_available_workflows', expect.any(Buffer), {
        persistent: true
      });
    });
  })
});