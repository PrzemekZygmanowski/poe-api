import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenaiService {
  private openai;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
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
    const { model } = chatParams;
    console.log(this.openai);

    const completion = await this.openai.createCompletion({
      model: model,
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
    });
    console.log('asdasdad', completion);

    return completion;
  }
}
