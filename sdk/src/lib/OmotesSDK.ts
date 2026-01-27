import { Workflow } from '@omotes/proto';
import { Connection, connect } from 'amqplib';
import { BehaviorSubject, Observable } from 'rxjs';
import { getChannel } from './channel';
import { Job } from './Job';
import { getProfile } from './profiles';
import { getSubmissionsQueue } from './queue';
import { OmotesSDKOptions } from './types';
import { setupAvailableWorkflows } from './workflow';

export class OmotesSDK {
  private _connection: Connection | null = null;
  private _isConnected = false;
  private _isReconnecting = false;
  private _manualDisconnect = false;
  private readonly workflows$ = new BehaviorSubject<Workflow.AsObject[]>([]);

  public get workflows(): Observable<Workflow.AsObject[]> {
    // Trigger connection attempt if not connected and not already reconnecting
    if (
      !this._isConnected &&
      !this._isReconnecting &&
      !this._manualDisconnect
    ) {
      this.handleReconnect();
    }
    return this.workflows$.asObservable();
  }

  private get connection() {
    if (!this._connection) {
      throw new Error(`OmotesSDK is not connected. Call connect() first.`);
    }
    return this._connection as Connection;
  }

  constructor(private readonly options: OmotesSDKOptions) {}

  public async connect() {
    this._manualDisconnect = false;

    this._connection = await connect({
      hostname: this.options.rabbitMQUrl,
      username: this.options.rabbitMQUsername,
      password: this.options.rabbitMQPassword,
      port: this.options.rabbitMQPort,
      vhost: 'omotes',
    });

    this._connection.on('error', (err) => {
      console.error('[OmotesSDK] Connection error:', err.message);
    });

    this._connection.on('close', () => {
      this._isConnected = false;
      this.workflows$.next([]);
      if (!this._manualDisconnect) {
        console.warn(
          '[OmotesSDK] Connection closed unexpectedly, attempting reconnect...'
        );
        this.handleReconnect();
      }
    });

    const { trigger, workflows, ready } = await setupAvailableWorkflows(
      this.connection,
      this.options.id
    );
    workflows.subscribe((wf) => {
      this.workflows$.next(wf);
    });

    // Prevents race condition where trigger is called before the channel is ready
    await ready();
    trigger();

    this._isConnected = true;
    console.log('[OmotesSDK] Connected successfully');
  }

  public async createJob(type: Workflow.AsObject['typeName'], esdl: string) {
    const queue = getSubmissionsQueue();
    const { channel } = await getChannel(this.connection, queue);
    const job = new Job(type, esdl, this.connection, channel);
    return job;
  }

  public async getProfile(
    dbName: string,
    host: string,
    port: number,
    measurement: string,
    field: string
  ) {
    return getProfile(
      dbName,
      host,
      port,
      measurement,
      field,
      this.options.influxUser,
      this.options.influxPassword
    );
  }

  public async disconnect() {
    this._manualDisconnect = true;
    this._isConnected = false;
    this.workflows$.next([]);
    if (this._connection) {
      try {
        await this._connection.close();
      } catch {
        // Ignore errors during intentional close
      }
      this._connection = null;
    }
  }

  private async handleReconnect() {
    if (this._isReconnecting) return;
    this._isReconnecting = true;

    const maxRetries = 10;
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      console.log(
        `[OmotesSDK] Reconnection attempt ${attempt}/${maxRetries} in ${delay}ms...`
      );

      await this.sleep(delay);

      try {
        await this.connect();
        console.log('[OmotesSDK] Reconnected successfully');
        this._isReconnecting = false;
        return;
      } catch (err) {
        console.error(
          `[OmotesSDK] Reconnection attempt ${attempt} failed:`,
          (err as Error).message
        );
      }
    }

    this._isReconnecting = false;
    console.error('[OmotesSDK] Max reconnection attempts reached. Giving up.');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
