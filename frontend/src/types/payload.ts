import { Action } from "../enums/action";

export type Payload = {
  eventId: string;
  action: Action;
};
