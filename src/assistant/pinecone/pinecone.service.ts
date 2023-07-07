import { Injectable } from '@nestjs/common';
import { PineconeClient } from 'pinecone-client';

@Injectable()
export class PineconeService {
  private pinecone;

  constructor() {
    this.pinecone = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY,
      baseUrl: process.env.PINECONE_BASE_URL,
      namespace: process.env.PINECONE_NAMESPACE,
    });
  }

  async upsert(vectors: number[]): Promise<any> {
    return this.pinecone.upsert({
      vectors: [vectors],
    });
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
