import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Action } from '../enums/action';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(Action)
  action: Action;
}
