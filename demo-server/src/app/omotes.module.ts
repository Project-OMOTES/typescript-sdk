import { DynamicModule, Module } from '@nestjs/common';
import { OmotesSDKOptions } from '@omotes/sdk';
import { OmotesController } from './omotes.controller';
import { OmotesService } from './omotes.service';

@Module({})
export class OmotesModule {
  static async forRoot(options: OmotesSDKOptions): Promise<DynamicModule> {
    const service = new OmotesService();
    await service.init(options);
    return {
      module: OmotesModule,
      providers: [
        {
          provide: OmotesService,
          useValue: service,
        },
      ],
      controllers: [OmotesController],
      exports: [OmotesService],
    }
  }
}
