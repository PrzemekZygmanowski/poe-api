import { Module } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { ConversationService } from './conversation/conversation.service';
import { PineconeService } from './pinecone/pinecone.service';
import { AssistantController } from './assistant.controller';
import { MessageService } from './message/message.service';
import { MemoriesService } from './memories/memories.service';
import { NotesService } from './notes/notes.service';
import { LinksService } from './links/links.service';
import { ActionsService } from './actions/actions.service';

@Module({
  controllers: [AssistantController],
  providers: [
    OpenaiService,
    ConversationService,
    PineconeService,
    MessageService,
    MemoriesService,
    NotesService,
    LinksService,
    ActionsService,
  ],
  exports: [
    OpenaiService,
    ConversationService,
    PineconeService,
    MessageService,
  ],
})
export class AssistantModule {}
