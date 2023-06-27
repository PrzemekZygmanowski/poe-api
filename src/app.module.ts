import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AssistantModule } from './assistant/assistant.module';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AssistantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
