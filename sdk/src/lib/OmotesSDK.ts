import { Connection, connect } from 'amqplib';
import { from } from 'rxjs';
import { Job } from './Job';
import { ProgressHandler } from './handlers/ProgressHandler';
import { getProgressQueue, getSubmissionQueue } from './queue';
import { JobTypeName, OmotesSDKOptions } from './types';

export class OmotesSDK {
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
    const queue = getSubmissionQueue(type);
    const job = new Job(type, esdl);
    const channel = await this.getChannel(queue);
    channel.sendToQueue(queue, Buffer.from(job.toBuffer()));
    return job;
  }

  public getProgressHandler(job: Job) {
    return new ProgressHandler(job, from(this.getChannel(getProgressQueue(job))));
  }

  public getResultsHandler(job: Job) {
    throw new Error('Not implemented');
  }

  public getStatusHandler(job: Job) {
    throw new Error('Not implemented');
  }

  private async getChannel(queue: string) {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue);
    return channel;
  }
}
