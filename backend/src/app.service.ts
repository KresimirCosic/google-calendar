import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';

import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly _prismaService: PrismaService) {}

  async createEvent(createEventDto: CreateEventDto) {
    const { eventId, action } = createEventDto;

    return this._prismaService.googleCalendarEvent.create({
      data: {
        eventId,
        action: action as $Enums.Action,
      },
    });
  }
}
