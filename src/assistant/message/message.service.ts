import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IResource } from '../interface';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessageResource(messageArg: IResource) {
    const { title, description, url, tags, category } = messageArg;

    return await this.prisma.resources.create({
      data: { title, description, url, tags, category, synced: true },
    });
  }
}
