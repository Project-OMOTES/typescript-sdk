import { Connection, connect } from 'amqplib';
import { QueueManager } from './QueueManager';
import { JobTypeName, OmotesSDKOptions } from './types';

export class OmotesSDK {
  private static readonly queueManager = new QueueManager();

  private _connection: Connection | null = null;
  private get connection() {
    if (!this._connection) {
      throw new Error(`OmotesSDK is not connected. Call connect() first.`);
    }
    return this._connection as Connection;
  }

  constructor(private readonly options: OmotesSDKOptions) { }

  public async connect() {
    this._connection = await connect({
      hostname: this.options.rabbitMQUrl,
      username: this.options.rabbitMQUsername,
      password: this.options.rabbitMQPassword,
      port: this.options.rabbitMQPort,
    });
  }

  public async submitJob(type: JobTypeName, esdl: string) {
    const queue = OmotesSDK.queueManager.getSubmissionQueue(type);
    const channel = await this.getChannel(queue);
    channel.sendToQueue(queue, Buffer.from(esdl));
  }

  private async getChannel(queue: string) {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue);
    return channel;
  }
}
