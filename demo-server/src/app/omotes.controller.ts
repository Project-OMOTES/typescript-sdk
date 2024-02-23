import { Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { JobTypeName } from '@omotes/sdk';
import { Request, Response } from 'express';
import { OmotesService } from './omotes.service';

export interface SubmitJobRequest {
  type: JobTypeName;
  esdl: string;
}

@Controller('omotes')
export class OmotesController {
  constructor(private readonly omotesService: OmotesService) { }
  @Post()
  public submitJob(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    const esdl = req.rawBody.toString('utf-8');
    return this.omotesService.submitJob(esdl).subscribe((outputEsdl) => {
      res.type('application/xml');
      res.send(outputEsdl);
    });
  }
}

