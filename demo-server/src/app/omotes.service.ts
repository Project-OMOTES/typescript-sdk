import { Injectable } from '@nestjs/common';
import { OmotesSDK, OmotesSDKOptions } from '@omotes/sdk';
import { from, map, switchMap } from 'rxjs';

@Injectable()
export class OmotesService {
  private sdk: OmotesSDK;
  public async init(options: OmotesSDKOptions) {
    this.sdk = new OmotesSDK(options);
    await this.sdk.connect();
  }

  public submitJob(esdl: string) {
    return from(this.sdk.createJob('grow_simulator', esdl)).pipe(
      switchMap((job) => {
        job.start();
        return job.getResultHandler().getResult();
      }),
      map((result) => result.outputEsdl)
    )
  }
}
