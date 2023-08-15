import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AssistantDTO } from './AssistantDTO';
import { IResource, IResponseArgs } from './interface';
import { possibleCategory, possibleType } from '../helpers/variables';
import { ConversationService } from './conversation/conversation.service';
import { MemoriesService } from './memories/memories.service';
import { MessageService } from './message/message.service';
import { OpenaiService } from '../openai/openai.service';
import { PineconeService } from '../pinecone/pinecone.service';

@Controller('assistant')
export class AssistantController {
  private intention: any;

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly conversationService: ConversationService,
    private readonly pineconeService: PineconeService,
    private readonly memoriesService: MemoriesService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  async askPoe(@Body() assistantQuery: AssistantDTO) {
    if (!assistantQuery.category) {
      throw new HttpException(`Sorry, no message category entered`, 404);
    }

    if (!possibleType.includes(assistantQuery.type)) {
      const getIntention = await this.openaiService.describeIntention(
        assistantQuery.query,
      );
      this.intention = JSON.parse(getIntention);
    }

    if (!possibleCategory.includes(assistantQuery.category)) {
      throw new HttpException(
        `Sorry, category ${assistantQuery.category} is incorrect. Try one of these: 'message', 'note'.`,
        404,
      );
    }

    const embed = await this.pineconeService.createEmbedding(
      assistantQuery.query,
    );

    const matches = await this.pineconeService.query(embed, 10, 'category', [
      assistantQuery.category,
    ]);

    const memories = await this.pineconeService.getContext(matches);
    console.log(memories);

    // const context = { memories: [] };
    // const memories = await this.memoriesService.findAllBy('id', matches);
    // context.memories = memories.map((memory) => memory.content);

    const responseArgs: IResponseArgs = {
      query: assistantQuery.query,
      context: assistantQuery.context,
      model: assistantQuery.chatParams.model,
    };

    const response = await this.openaiService.createChatCompletion(
      responseArgs,
    );

    const data = await this.messageService.createMessageResource({
      title: response.title,
      description: response.answer,
      url: '',
      tags: response.tags,
      category: assistantQuery.category,
      synced: true,
    });

    await this.pineconeService.upsert(data.id, embed, assistantQuery.category);
    // await this.conversationService.createConversation(
    //   assistantQuery.query,
    //   response,
    // );

    if (!response) {
      throw new HttpException(`Sorry, There is problem with connection`, 500);
    }

    return response;
  }
}
