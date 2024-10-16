import { JobCancel, JobSubmission } from '@omotes/proto';
import { Channel, Connection } from 'amqplib';
import { from } from 'rxjs';
import { uuidv7 } from 'uuidv7';
import { getChannel } from './channel';
import { ProgressHandler } from './handlers/ProgressHandler';
import { ResultHandler } from './handlers/ResultHandler';
import { StatusHandler } from './handlers/StatusHandler';
import { getProgressQueue, getResultQueue } from './queue';
import { JobTypeName } from './types';

export class Job {
  public readonly uuid = uuidv7();
  private readonly jobSubmission = new JobSubmission();

  constructor(
    public readonly type: JobTypeName,
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
    this.channel.sendToQueue(`job_submissions.${this.type}`, this.toBuffer(this.jobSubmission), { persistent: true });
  }

  public cancel() {
    const cancel = new JobCancel();
    cancel.setUuid(this.uuid);
    this.channel.sendToQueue(`job_submissions.${this.type}`, this.toBuffer(cancel), { persistent: true });
  }

  public getProgressHandler() {
    return new ProgressHandler(this, from(getChannel(this.conn, getProgressQueue(this))));
  }

  public getStatusHandler() {
    return new StatusHandler(this, from(getChannel(this.conn, getProgressQueue(this))));
  }

  public getResultHandler() {
    return new ResultHandler(this, from(getChannel(this.conn, getResultQueue(this))));
  }

  private toBuffer(message: JobSubmission | JobCancel) {
    return Buffer.from(message.serializeBinary());
  }
}
