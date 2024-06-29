import { Injectable } from '@nestjs/common';

import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly _prismaService: PrismaService) {}

  async createEvent(createEventDto: CreateEventDto) {
    const { userId, eventId, action } = createEventDto;

    return this._prismaService.googleCalendarEvent.create({
      data: {
        userId,
        eventId,
        action,
      },
    });
  }
}
