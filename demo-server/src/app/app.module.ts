import { Module } from '@nestjs/common';

import { OmotesController } from './omotes.controller';
import { OmotesModule } from './omotes.module';

@Module({
  imports: [
    OmotesModule.forRoot({
      rabbitMQUrl: 'localhost',
      rabbitMQUsername: 'omotes',
      rabbitMQPassword: 'somepass1',
      rabbitMQPort: 5672,
    }),
  ],
  controllers: [OmotesController],
  providers: [],
})
export class AppModule { }
