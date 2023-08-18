import { Injectable, Inject } from '@nestjs/common';
import { IMessageAnswer, IResponseArgs } from '../assistant/interface';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { createStructuredOutputChainFromZod } from 'langchain/chains/openai_functions';
import { messageCompletionSchema } from '../helpers/answersSchema';

@Injectable()
export class OpenaiService {
  private assistant;

  constructor() {
    this.assistant = new ChatOpenAI({
      temperature: 0.9,
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async describeIntention(query: string): Promise<any> {
    const intention = await this.assistant.call([
      new HumanMessage(
        `Describe my intention from message below with JSON. Focus on the beginning of it.
        Always return JSON and nothing more. Types: action|query|memory. Example: "save the note." {"type":"action"};
         "write the newsletter." {"type":"action"}, "Are You Poe?". {"type":"query"}; "Remember that Bagietka is a cat". {"type":"memory"},
         ####message\n${query}`,
      ),
    ]);
    return intention.content;
  }

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
}
