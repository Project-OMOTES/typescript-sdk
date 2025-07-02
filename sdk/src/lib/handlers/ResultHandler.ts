import { JobResult } from '@omotes/proto';
import { first, map } from 'rxjs';
import { getResultQueue } from '../queue';
import { JobHandler } from './JobHandler';

export class ResultHandler extends JobHandler {
  protected override queue: string = getResultQueue(this.job);

  public getResult() {
    const messages$ = this.channelToRx().pipe(first());
    return messages$.pipe(
      map((message) => {
        const result = JobResult.deserializeBinary(message.content);
        return result.toObject();
      })
    );
  }
}
