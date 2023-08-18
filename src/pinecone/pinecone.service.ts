import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeClient } from '@pinecone-database/pinecone';
import { MemoriesService } from '../assistant/memories/memories.service';

@Injectable()
export class PineconeService {
  private pinecone;
  private embeddings;
  private pineconeIndex;

  constructor(private readonly memoriesService: MemoriesService) {
    this.pinecone = new PineconeClient();
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async initPinecone() {
    if (!this.pineconeIndex) {
      await this.pinecone.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
      });
      this.pineconeIndex = this.pinecone.Index(process.env.PINECONE_INDEX_NAME);
    }
  }

  async createEmbedding(prompt: string): Promise<any> {
    const embed = await this.embeddings.embedQuery(prompt);
    return embed;
  }

  async upsert(id: number, vectors: number[], category: string): Promise<any> {
    await this.initPinecone();

    const upsertVectors = await this.pineconeIndex.upsert({
      upsertRequest: {
        vectors: [
          {
            id: id.toString(),
            values: vectors,
            metadata: { category: category },
          },
        ],
        namespace: process.env.PINECONE_NAMESPACE,
      },
    });
    return upsertVectors;
  }

  async query(
    vector: number[],
    topK = 10,
    metadataKey: string,
    metadataValue: string[],
  ) {
    await this.initPinecone();

    const queryRequest = {
      topK,
      vector,
      includeMetadata: false,
      includeValues: false,
      namespace: process.env.PINECONE_NAMESPACE,
      filter: { [metadataKey]: { ['$in']: metadataValue } },
    };

    const { matches } = await this.pineconeIndex.query({ queryRequest });

    return matches
      .filter(
        (match) =>
          match.score >=
          matches.reduce((acc, match) => acc + match.score, 0) / matches.length,
      )
      .map((match) => match.id);
  }

  async getMemories(ids: string[]) {
    const convertedIds = ids.map(Number);
    const context = { memories: [] };
    const memories = await this.memoriesService.findAllBy('id', convertedIds);
    context.memories = memories.map((memory) => memory.description);
    return context.memories;
  }
}
