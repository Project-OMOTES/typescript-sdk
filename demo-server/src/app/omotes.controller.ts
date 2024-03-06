import { Body, Controller, Post } from '@nestjs/common';
import { JobTypeName } from '@omotes/sdk';
import { OmotesService } from './omotes.service';

export interface SubmitJobRequest {
  type: JobTypeName;
  esdl: string;
}

@Controller('omotes')
export class OmotesController {
  constructor(private readonly omotesService: OmotesService) { }
  @Post()
  public submitJob(@Body() body: SubmitJobRequest) {
    return this.omotesService.submitJob(body.type, body.esdl);
  }
}

