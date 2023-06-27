import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(question, answer) {
    return await this.prisma.conversation.create({
        data: {question, answer}
  }
}
