import { JobProgressUpdate } from '@omotes/proto';
import { Channel, ConsumeMessage } from 'amqplib';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { Job } from '../Job';
import { getProgressQueue } from '../queue';

export class ProgressHandler {
  private readonly queue = getProgressQueue(this.job);
  private readonly close$ = new Subject<void>();

  constructor(private readonly job: Job, private readonly channel$: Observable<Channel>) { }

  public getProgress() {
    return this.channel$.pipe(
      switchMap((channel) => {
        return new Observable<ConsumeMessage>((observer) => {
          channel.consume(this.queue, (message) => {
            if (message) {
              observer.next(message);
              channel.ack(message);
            }
          });
          return () => channel.close();
        }).pipe(takeUntil(this.close$));
      }),
      map((message) => {
        const progress = JobProgressUpdate.deserializeBinary(message.content);
        return progress.toObject().progress;
      })
    );
  }

  public close() {
    this.close$.next();
    this.close$.complete();
  }
}