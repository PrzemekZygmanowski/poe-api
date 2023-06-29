import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { IResponseArgs } from '../interface';

@Injectable()
export class OpenaiService {
  private openai;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async createEmbedding(prompt: string): Promise<any> {
    const { data: embed } = await this.openai.createEmbedding({
      input: prompt,
      model: 'text-embedding-ada-002',
    });

    return embed;
  }

  async createChatCompletion(responseArgs: IResponseArgs): Promise<any> {
    const { query, context, model } = responseArgs;

    const body = {
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant named Poe (Personal Operating Entity). \n\n\nContext: "based on this context: ${context} answer the question below as truthfully as you can. \n\n\n
          Additionally: \ncreate in a one sentence a title for your answer \nCreate 3-4 one word tags based on the question and answer. \n\n\nReturn response in JSON format with structure:
          {title, answer, tags} \n\n\nReturn only JSON and nothing more.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
    };

    const completion = await this.openai.createChatCompletion(body);
    const response = completion.data.choices[0].message.content;

    return response;
  }
}
