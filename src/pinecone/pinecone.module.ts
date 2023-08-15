import { Module } from '@nestjs/common';
import { PineconeService } from './pinecone.service';
import { MemoriesService } from '../assistant/memories/memories.service';

@Module({
  providers: [PineconeService, MemoriesService],
  exports: [PineconeService],
})
export class PineconeModule {}
