import { Workflow } from '@omotes/proto';
import { Connection, connect } from 'amqplib';
import { Observable } from 'rxjs';
import { getChannel } from './channel';
import { Job } from './Job';
import { getProfile } from './profiles';
import { getSubmissionsQueue } from './queue';
import { OmotesSDKOptions } from './types';
import { setupAvailableWorkflows } from './workflow';

export class OmotesSDK {
  private _connection: Connection | null = null;
  public workflows!: Observable<Workflow.AsObject[]>;

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
    this.workflows = await setupAvailableWorkflows(this.connection, this.options.id);
  }

  public async createJob(type: Workflow.AsObject['typeName'], esdl: string) {
    const queue = getSubmissionsQueue();
    const { channel } = await getChannel(this.connection, queue);
    const job = new Job(type, esdl, this.connection, channel);
    return job;
  }

  public async getProfile(
    dbName: string, host: string, port: number, measurement: string, field: string
  ) {
    return getProfile(dbName, host, port, measurement, field, this.options.influxUser, this.options.influxPassword);
  }
}
