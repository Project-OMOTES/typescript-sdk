import { JobSubmission } from '@omotes/proto';
import { uuidv7 } from 'uuidv7';
import { JobTypeName } from './types';

export class Job {
  public readonly uuid = uuidv7();
  private readonly jobSubmission = new JobSubmission();

  constructor(
    public readonly type: JobTypeName,
    esdl: string
  ) {
    this.jobSubmission.setUuid(this.uuid);
    this.jobSubmission.setWorkflowType(type);
    this.jobSubmission.setEsdl(esdl);
    this.jobSubmission.setTimeoutMs(0);
  }

  public toBuffer() {
    return this.jobSubmission.serializeBinary();
  }
}
