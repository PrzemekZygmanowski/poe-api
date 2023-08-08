import { Module } from '@nestjs/common';
import { ConversationService } from './conversation/conversation.service';
import { AssistantController } from './assistant.controller';
import { MessageService } from './message/message.service';
import { MemoriesService } from './memories/memories.service';
import { NotesService } from './notes/notes.service';
import { LinksService } from './links/links.service';
import { ActionsService } from './actions/actions.service';
import { PineconeModule } from '../pinecone/pinecone.module';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  controllers: [AssistantController],
  imports: [PineconeModule, OpenaiModule],
  providers: [
    ConversationService,
    MessageService,
    MemoriesService,
    NotesService,
    LinksService,
    ActionsService,
  ],
  exports: [ConversationService, MessageService],
})
export class AssistantModule {}
