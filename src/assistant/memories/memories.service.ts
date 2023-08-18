import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IMessageAnswer, IResource, IResponseArgs } from '../interface';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { createStructuredOutputChainFromZod } from 'langchain/chains/openai_functions';
import { messageCompletionSchema } from '../../helpers/answersSchema';

@Injectable()
export class MemoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createChatCompletion(
    responseArgs: IResponseArgs,
  ): Promise<IMessageAnswer> {
    const { query, context, model, memories } = responseArgs;

    const conversation = new ChatOpenAI({
      temperature: 0.9,
      modelName: model,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chatPrompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
          `You are a helpful assistant named Poe (Personal Operating Entity). \n\n\nContext: "based on this context: {context} answer the question below as truthfully as you can.
          ${
            memories.length
              ? `Answer using own memories '''${memories.join('\n\n\n')}'''`
              : ''
          }`,
        ),
        HumanMessagePromptTemplate.fromTemplate('{input}'),
      ],
      inputVariables: ['input', 'context'],
    });

    const conversationChain = createStructuredOutputChainFromZod(
      messageCompletionSchema,
      {
        prompt: chatPrompt,
        llm: conversation,
      },
    );

    const response = await conversationChain.call({
      input: query,
      context: context,
    });

    return response.output;
  }

  async findAllBy(
    key: string,
    value: string | string[] | number | number[],
  ): Promise<any> {
    return await this.prisma.resources.findMany({
      where: { [key]: { in: value } },
    });
  }
}
