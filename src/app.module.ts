import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessagesController } from './messages/messages.controller';
import { OperationsController } from './operations/operations.controller';

@Module({
  imports: [],
  controllers: [AppController, MessagesController, OperationsController],
  providers: [],
})
export class AppModule {}
