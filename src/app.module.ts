import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AssistantController } from './assistant/assistant.controller';
import { ShortcutsController } from './shortcuts/shortcuts.controller';
import { OpenaiService } from './assistant/openai/openai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AssistantController, ShortcutsController],
  providers: [OpenaiService],
})
export class AppModule {}
