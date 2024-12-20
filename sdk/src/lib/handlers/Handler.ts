import { Channel, ConsumeMessage } from 'amqplib';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';

export abstract class Handler {
  protected readonly abstract queue: string;
  protected readonly close$ = new Subject<void>();
  constructor(protected readonly channel$: Observable<Channel>) { }

  protected channelToRx() {
    return this.channel$.pipe(
      switchMap((channel) => {
        return new Observable<ConsumeMessage>((observer) => {
          channel.consume(this.queue, (message) => {
            if (message) {
              observer.next(message);
              channel.ack(message);
            }
          });
          return () => {
            channel.deleteQueue(this.queue);
          };
        }).pipe(takeUntil(this.close$));
      }),
    )
  }

  public close() {
    this.close$.next();
    this.close$.complete();
  }
}