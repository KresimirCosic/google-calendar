export type CreateCalendarEventBody = {
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  summary?: string;
  description?: string;
};
