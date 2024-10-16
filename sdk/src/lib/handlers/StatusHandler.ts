import { JobStatusUpdate } from '@omotes/proto';
import { Observable, map } from 'rxjs';
import { getStatusQueue } from '../queue';
import { JobHandler } from './JobHandler';

export class StatusHandler extends JobHandler {
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