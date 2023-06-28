import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'hello!';
  }

  @Get('/user')
  getSample() {
    return { name: 'PRzemek' };
  }
}
