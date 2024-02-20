import { JobProgressUpdate } from '@omotes/proto';
import { map } from 'rxjs';
import { getProgressQueue } from '../queue';
import { Handler } from './Handler';

export class ProgressHandler extends Handler {
  protected override queue: string = getProgressQueue(this.job);

  public getProgress() {
    const messages$ = this.channelToRx();
    return messages$.pipe(
      map((message) => {
        const progress = JobProgressUpdate.deserializeBinary(message.content);
        return progress.toObject().progress;
      })
    );
  }
}