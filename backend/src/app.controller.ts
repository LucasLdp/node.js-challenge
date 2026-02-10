import { Controller, Get } from '@nestjs/common';
import { Public } from '@/modules/auth/infra/decorators/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): { hello: string } {
    return this.appService.getHello();
  }
}
