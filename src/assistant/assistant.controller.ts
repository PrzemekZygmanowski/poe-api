import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AssistantDTO } from './AssistantDTO';
import { OpenaiService } from './openai/openai.service';
import { IResponseArgs } from './interface';
import { possibleCategory, possibleType } from '../helpers/variables';
import { ConversationService } from './conversation/conversation.service';

@Controller('assistant')
export class AssistantController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly conversationService: ConversationService,
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

    const responseArgs: IResponseArgs = {
      query: assistantQuery.query,
      context: assistantQuery.context,
      model: assistantQuery.chatParams.model,
    };

    const response = await this.openaiService.createChatCompletion(
      responseArgs,
    );
    const parsedResponse = JSON.parse(response);
    // const embed = await this.openaiService.createEmbedding(
    //   assistantQuery.query,
    // );

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
