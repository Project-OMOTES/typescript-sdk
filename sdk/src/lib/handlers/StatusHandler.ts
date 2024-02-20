import { JobStatusUpdate } from '@omotes/proto';
import { Observable, map } from 'rxjs';
import { getStatusQueue } from '../queue';
import { Handler } from './Handler';

export class StatusHandler extends Handler {
  protected override queue: string = getStatusQueue(this.job);

  public getStatus(): Observable<JobStatusUpdate.JobStatusMap[keyof JobStatusUpdate.JobStatusMap]> {
    const messages$ = this.channelToRx();
    return messages$.pipe(
      map((message) => {
        const status = JobStatusUpdate.deserializeBinary(message.content);
        return status.toObject().status;
      })
    );
  }
}