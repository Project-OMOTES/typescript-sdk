import { Connection, connect } from 'amqplib';
import { Job } from './Job';
import { getChannel } from './channel';
import { getProfile } from './profiles';
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

  public async getProfile(
    dbName: string, host: string, port: number, measurement: string, field: string, filterId: string
  ) {
    return getProfile(dbName, host, port, measurement, field, filterId, this.options.influxUser, this.options.influxPassword);
  }
}
