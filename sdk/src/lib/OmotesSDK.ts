import { Connection, connect } from 'amqplib';
import { Job } from './Job';
import { getChannel } from './channel';
import { getSubmissionQueue } from './queue';
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
      vhost: 'omotes',
    });
  }

  public async createJob(type: JobTypeName, esdl: string) {
    const queue = getSubmissionQueue(type);
    const channel = await getChannel(this.connection, queue);
    const job = new Job(type, esdl, this.connection, channel);
    return job;
  }
}
