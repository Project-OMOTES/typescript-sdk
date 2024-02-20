import { Observable } from 'rxjs';
import { uuidv7 } from 'uuidv7';
import { JobTypeName } from './types';

export class Job {
  public readonly uuid = uuidv7();
  constructor(
    public readonly type: JobTypeName
  ) { }

  public getProgress() {
    return new Observable((subscriber) => {
      subscriber.next(0);
      subscriber.next(50);
      subscriber.next(100);
      subscriber.complete();
    });
  }
}
