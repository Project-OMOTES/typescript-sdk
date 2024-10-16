import { JobCancel, JobSubmission, Workflow } from '@omotes/proto';
import { Channel, Connection } from 'amqplib';
import { JavaScriptValue, Struct } from 'google-protobuf/google/protobuf/struct_pb';
import { from } from 'rxjs';
import { uuidv7 } from 'uuidv7';
import { getChannel } from './channel';
import { ProgressHandler } from './handlers/ProgressHandler';
import { ResultHandler } from './handlers/ResultHandler';
import { StatusHandler } from './handlers/StatusHandler';
import { getCancellationsQueue, getProgressQueue, getResultQueue, getStatusQueue, getSubmissionsQueue } from './queue';


export type ParamsDict = { [key: string]: JavaScriptValue };

export class Job {
  public readonly uuid = uuidv7();
  private readonly jobSubmission = new JobSubmission();

  constructor(
    public readonly type: Workflow.AsObject['typeName'],
    private readonly esdl: string,
    private readonly conn: Connection,
    private readonly channel: Channel,
  ) {
    this.jobSubmission.setUuid(this.uuid);
    this.jobSubmission.setWorkflowType(type);
    this.jobSubmission.setEsdl(this.esdl);
    this.jobSubmission.setTimeoutMs(0);
  }

  public start() {
    this.channel.sendToQueue(getSubmissionsQueue(), this.toBuffer(this.jobSubmission), { persistent: true });
    return this;
  }

  public cancel() {
    const cancel = new JobCancel();
    cancel.setUuid(this.uuid);
    this.channel.sendToQueue(getCancellationsQueue(), this.toBuffer(cancel), { persistent: true });
    return this;
  }

  public setParams(params: ParamsDict) {
    this.jobSubmission.setParamsDict(Struct.fromJavaScript(params));
    return this;
  }

  public getProgressHandler() {
    return new ProgressHandler(this, from(this.getChannelInstance(this.conn, getProgressQueue(this))));
  }

  public getStatusHandler() {
    return new StatusHandler(this, from(this.getChannelInstance(this.conn, getStatusQueue(this))));
  }

  public getResultHandler() {
    return new ResultHandler(this, from(this.getChannelInstance(this.conn, getResultQueue(this))));
  }

  private async getChannelInstance(connection: Connection, channelName: string) {
    const { channel } = await getChannel(connection, channelName);
    return channel;
  }

  private toBuffer(message: JobSubmission | JobCancel) {
    return Buffer.from(message.serializeBinary());
  }
}
