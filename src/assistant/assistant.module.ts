import { Module } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { ConversationService } from './conversation/conversation.service';
import { PineconeService } from './pinecone/pinecone.service';
import { AssistantController } from './assistant.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageService } from './message/message.service';

@Module({
  controllers: [AssistantController],
  providers: [OpenaiService, ConversationService, PineconeService, MessageService],
})
export class AssistantModule {}
