import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { cron } from 'node-cron';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    //https://docs.nestjs.com/techniques/task-scheduling
    await this.deleteRecordsOlderThan5Minutes();
    cron.schedule('*/5 * * * *', async () => {
      await this.deleteRecordsOlderThan5Minutes();
    });
  }

  async createConversation(question, answer) {
    return await this.prisma.conversation.create({
      data: { question, answer },
    });
  }

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
