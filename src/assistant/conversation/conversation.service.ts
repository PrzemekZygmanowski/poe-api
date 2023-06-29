import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    //https://docs.nestjs.com/techniques/task-scheduling
    await this.deleteRecordsOlderThan5Minutes();
  }

  async createConversation(question: string, answer: string) {
    return await this.prisma.conversation.create({
      data: { question, answer },
    });
  }

  @Cron('*/5 * * * *')
  private async deleteRecordsOlderThan5Minutes(): Promise<void> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await this.prisma.conversation.deleteMany({
      where: {
        createdAt: {
          lte: fiveMinutesAgo,
        },
      },
    });
  }
}
