import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AssistantDTO } from './AssistantDTO';
import { OpenaiService } from './openai/openai.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('')
  async askPoe(@Body() assistantQuery: AssistantDTO) {
    if (assistantQuery.type !== ('save' || 'query' || 'forget' || 'remember')) {
      throw new HttpException(
        `Sorry, type ${assistantQuery.type} is incorrect. Try one of these: 'save', 'query', 'forget' or 'remember'.`,
        404,
      );
    }

    if (assistantQuery.category !== ('message' || 'note')) {
      throw new HttpException(
        `Sorry, category ${assistantQuery.category} is incorrect. Try one of these: 'message', 'note'.`,
        404,
      );
    }

    const response = await this.openaiService.createChatCompletion(
      assistantQuery.query,
      assistantQuery.context,
      assistantQuery.chatParams,
    );

    return response;
  }
}
