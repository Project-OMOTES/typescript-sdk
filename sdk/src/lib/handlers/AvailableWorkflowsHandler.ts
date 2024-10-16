import { AvailableWorkflows } from '@omotes/proto';
import { Channel } from 'amqplib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Handler } from './Handler';

export class AvailableWorkflowsHandler extends Handler {
  protected override queue = this.getQueueName();
  constructor(protected override readonly channel$: Observable<Channel>, private readonly clientId?: string) {
    super(channel$);
  }

  public getWorkflows() {
    return this.channelToRx().pipe(
      map((message) => {
        return AvailableWorkflows.deserializeBinary(message.content).toObject().workflowsList;
      })
    )
  }

  private getQueueName() {
    return `available_workflows.${this.clientId}`;
  }
}