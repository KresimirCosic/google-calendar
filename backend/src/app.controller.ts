import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Post()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this._appService.createEvent(createEventDto);
  }
}
