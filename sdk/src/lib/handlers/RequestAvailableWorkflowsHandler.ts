import { RequestAvailableWorkflows } from '@omotes/proto';
import { Channel } from 'amqplib';

export class RequestAvailableWorkflowsHandler {
  private queue = 'request_available_workflows';

  public start(channel: Channel) {
    const message = new RequestAvailableWorkflows();
    return channel.sendToQueue(this.queue, Buffer.from(message.serializeBinary()), { persistent: true });
  }
}