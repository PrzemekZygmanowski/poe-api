import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AssistantDTO } from './AssistantDTO';
import { OpenaiService } from './openai/openai.service';
import { IResponseArgs } from './interface';
import { possibleCategory, possibleType } from '../helpers/variables';
import { ConversationService } from './conversation/conversation.service';
import { PineconeService } from './pinecone/pinecone.service';
import { MemoriesService } from './memories/memories.service';

@Controller('assistant')
export class AssistantController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly conversationService: ConversationService,
    private readonly pineconeService: PineconeService,
    private readonly memoriesService: MemoriesService,
  ) {}

  @Post()
  async askPoe(@Body() assistantQuery: AssistantDTO) {
    if (!assistantQuery.type || !assistantQuery.category) {
      throw new HttpException(
        `Sorry, no message type or category entered`,
        404,
      );
    }

    if (!possibleType.includes(assistantQuery.type)) {
      throw new HttpException(
        `Sorry, type ${assistantQuery.type} is incorrect. Try one of these: 'save', 'query', 'forget' or 'remember'.`,
        404,
      );
    }

    if (!possibleCategory.includes(assistantQuery.category)) {
      throw new HttpException(
        `Sorry, category ${assistantQuery.category} is incorrect. Try one of these: 'message', 'note'.`,
        404,
      );
    }

    const embed = await this.openaiService.createEmbedding(
      assistantQuery.query,
    );
    const matches = await this.pineconeService.query(
      embed.data[0].embedding,
      10,
      'category',
      [assistantQuery.category],
    );
    const context = { memories: [] };
    const memories = await this.memoriesService.findAllBy('id', matches);
    context.memories = memories.map((memory) => memory.content);

    console.log(context);

    const responseArgs: IResponseArgs = {
      query: assistantQuery.query,
      context: assistantQuery.context,
      model: assistantQuery.chatParams.model,
    };

    const response = await this.openaiService.createChatCompletion(
      responseArgs,
    );
    const parsedResponse = JSON.parse(response);

    await this.conversationService.createConversation(
      assistantQuery.query,
      parsedResponse.answer,
    );

    if (!response) {
      throw new HttpException(`Sorry, There is problem with connection`, 500);
    }

    return parsedResponse.answer;
  }
}
