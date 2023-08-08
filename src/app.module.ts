import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AssistantModule } from './assistant/assistant.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OpenaiService } from './openai/openai.service';
import { OpenaiModule } from './openai/openai.module';
import { PineconeModule } from './pinecone/pinecone.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AssistantModule,
    OpenaiModule,
    PineconeModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
