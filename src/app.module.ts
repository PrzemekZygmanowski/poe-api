import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AssistantController } from './assistant/assistant.controller';
import { ShortcutsController } from './shortcuts/shortcuts.controller';
import { OpenaiService } from './assistant/openai/openai.service';
import { ConfigModule } from '@nestjs/config';
import { PineconeService } from './assistant/pinecone/pinecone.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [AppController, AssistantController, ShortcutsController],
  providers: [OpenaiService, PineconeService],
})
export class AppModule {}
