import { Module } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { ConversationService } from './conversation/conversation.service';
import { PineconeService } from './pinecone/pinecone.service';
import { AssistantController } from './assistant.controller';

@Module({})
export class AssistantModule {
  providers: [OpenaiService, ConversationService, PineconeService];
  controllers: [AssistantController];
}
