import { Controller, Get } from '@nestjs/common';

@Controller('shortcuts')
export class ShortcutsController {
  @Get()
  getAllShortcuts() {
    return 'shortcutsy';
  }
}
