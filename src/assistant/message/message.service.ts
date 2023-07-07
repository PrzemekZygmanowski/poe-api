import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IResource } from '../interface';
import { PineconeService } from '../pinecone/pinecone.service';

@Injectable()
export class MessageService {
  constructor(
    @Inject(PineconeService)
    private readonly pineconeService: PineconeService,
    private readonly prisma: PrismaService,
  ) {}

  async createMessageResource(messageArg: IResource) {
    const { title, description, url, tags, category, synced } = messageArg;

    return await this.prisma.resources.create({
      data: { title, description, url, tags, category, synced },
    });
  }
}
