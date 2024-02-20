import { JobResult } from '@omotes/proto';
import { first, map } from 'rxjs';
import { getResultsQueue } from '../queue';
import { Handler } from './Handler';

export class ResultsHandler extends Handler {
  protected override queue: string = getResultsQueue(this.job);

  public getResult() {
    const messages$ = this.channelToRx().pipe(first());
    return messages$.pipe(
      map((message) => {
        const result = JobResult.deserializeBinary(message.content);
        if (result.getResultType() === JobResult.ResultType.ERROR) {
          throw new Error(`Job ${result.getUuid()} failed: ${result.getLogs()}`);
        }
        return result.toObject();
      })
    );
  }
}