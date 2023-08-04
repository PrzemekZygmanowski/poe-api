import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeClient } from '@pinecone-database/pinecone';
import { log } from 'console';

@Injectable()
export class PineconeService {
  private pinecone;
  private embeddings;

  constructor() {
    this.pinecone = new PineconeClient();
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createEmbedding(prompt: string): Promise<any> {
    const embed = await this.embeddings.embedQuery(prompt);
    return embed;
  }

  async upsert(id: number, vectors: number[]): Promise<any> {
    await this.pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    const index = this.pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const upsertVectors = await index.upsert({
      upsertRequest: {
        vectors: [{ id: id.toString(), values: vectors }],
        namespace: process.env.PINECONE_NAMESPACE,
      },
    });
    console.log(upsertVectors);
    return upsertVectors;
  }

  async query(
    vector: number[],
    topK = 10,
    metadataKey: string,
    metadataValue: string[],
  ) {
    const { matches } = await this.pinecone.query({
      vector,
      topK,
      includeMetadata: true,
      includeValues: false,
      filter: {
        [metadataKey]: { ['$in']: metadataValue },
      },
    });

    return matches
      .filter(
        (match) =>
          match.score >=
          matches.reduce((acc, match) => acc + match.score, 0) / matches.length,
      )
      .map((match) => match.id);
  }
}
