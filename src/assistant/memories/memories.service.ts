import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IResource } from '../interface';

@Injectable()
export class MemoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMemoriesResource(messageArg: IResource) {
    const { title, description, url, tags, category, synced } = messageArg;

    return await this.prisma.resources.create({
      data: { title, description, url, tags, category, synced },
    });
  }

  async findAllBy(
    key: string,
    value: string | string[] | number | number[],
  ): Promise<any> {
    return await this.prisma.resources.findMany({
      where: { [key]: { in: value } },
    });
  }
}
