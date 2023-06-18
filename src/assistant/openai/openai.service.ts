import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { json } from 'stream/consumers';

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

  async createEmbedding(prompt): Promise<any> {
    const { data: embed } = await this.openai.createEmbedding({
      input: prompt,
      model: 'text-embedding-ada-002',
    });

    return embed;
  }
  async createChatCompletion(prompt, context, chatParams): Promise<any> {
    const body = {
      model: chatParams.model,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant named Poe (Personal Operating Entity). \n\n\nContext: "based on this context ${context} answer the question below as truthfully as you can"`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };
    console.log('body', body);

    const completion = await this.openai.createChatCompletion(body);
    const response = completion.data.choices[0].message.content;

    return response;
  }
}
