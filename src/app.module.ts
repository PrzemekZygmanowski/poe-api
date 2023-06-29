import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AssistantModule } from './assistant/assistant.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, AssistantModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
