import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Action } from '../enums/action';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsEnum(Action)
  action: Action;
}
