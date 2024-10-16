import { Channel } from 'amqplib';
import { Observable } from 'rxjs';
import { Job } from '../Job';
import { Handler } from './Handler';

export abstract class JobHandler extends Handler {
  constructor(protected readonly job: Job, protected override readonly channel$: Observable<Channel>) {
    super(channel$);
  }
}