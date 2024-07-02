import { TokenResponse } from "@react-oauth/google";
import { useState } from "react";
import DateTimePicker from "react-datetime-picker";

import { googleCalendarEventBaseApiUrl } from "../../constants/google";
import { CreateCalendarEventBody, GoogleCalendarEvent } from "../../types";
import styles from "./GoogleCalendarEventCard.module.css";

type GoogleCalendarEventCardProps = {
  tokenResponse:
    | Omit<TokenResponse, "error" | "error_description" | "error_uri">
    | undefined;
  calendarEvent: GoogleCalendarEvent;
  getAllCalendarEvents: () => void;
};

function GoogleCalendarEventCard(props: GoogleCalendarEventCardProps) {
  const [editingEvent, setEditingEvent] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateEventName, setUpdateEventName] = useState(
    props.calendarEvent.summary
  );
  const [updateEventDescription, setUpdateEventDescription] = useState(
    props.calendarEvent.description
  );
  const [updateStartDatetime, setUpdateStartDatetime] = useState<Date>(
    new Date(props.calendarEvent.start.dateTime)
  );
  const [updateEndDatetime, setUpdateEndDatetime] = useState<Date>(
    new Date(props.calendarEvent.end.dateTime)
  );

  const updateCalendarEvent = (id: string) => {
    if (props.tokenResponse) {
      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      const body: CreateCalendarEventBody = {
        start: {
          dateTime: updateStartDatetime.toISOString(),
          timeZone,
        },
        end: {
          dateTime: updateEndDatetime.toISOString(),
          timeZone,
        },
        summary: updateEventName,
        description: updateEventDescription,
      };

      setIsUpdating(true);

      fetch(`${googleCalendarEventBaseApiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${props.tokenResponse.access_token}`,
        },
        method: "PUT",
        body: JSON.stringify(body),
      })
        .then((response) => {
          props.getAllCalendarEvents();
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsUpdating(false);
        });
    }
  };
  const deleteCalendarEvent = (id: string) => {
    if (props.tokenResponse) {
      setIsDeleting(true);

      fetch(`${googleCalendarEventBaseApiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${props.tokenResponse.access_token}`,
        },
        method: "DELETE",
      })
        .then((response) => {
          props.getAllCalendarEvents();
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsDeleting(false);
        });
    }
  };
  const handleDeleteCalendarEvent = (id: string) => {
    const shouldDeleteCalendarEvent = prompt(
      "Are you sure you want to delete the event? (type anything inside to confirm)"
    )?.trim();

    if (shouldDeleteCalendarEvent) deleteCalendarEvent(id);
  };
  const resetUpdateForm = () => {
    setUpdateStartDatetime(new Date(props.calendarEvent.start.dateTime));
    setUpdateEndDatetime(new Date(props.calendarEvent.end.dateTime));
    setUpdateEventName(props.calendarEvent.summary ?? "");
    setUpdateEventDescription(props.calendarEvent.description ?? "");
  };

  return (
    <li className={styles["google-calendar-event-card"]}>
      {editingEvent ? (
        <div>
          <h1>Update an event</h1>
          <p>Start datetime*</p>
          <DateTimePicker
            value={updateStartDatetime}
            onChange={(value) => {
              setUpdateStartDatetime(value as Date);
            }}
          />
          <br />
          <p>End datetime*:</p>
          <DateTimePicker
            value={updateEndDatetime}
            onChange={(value) => {
              setUpdateEndDatetime(value as Date);
            }}
          />
          <br />
          <p>
            Event summary <small>(optional)</small>:
          </p>
          <input
            type="text"
            value={updateEventName}
            onChange={(event) => setUpdateEventName(event.target.value)}
          />
          <p>
            Event description <small>(optional)</small>:
          </p>
          <input
            type="text"
            value={updateEventDescription}
            onChange={(event) => setUpdateEventDescription(event.target.value)}
          />
          <button
            onClick={() => {
              setEditingEvent(false);
              resetUpdateForm();
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => updateCalendarEvent(props.calendarEvent.id)}
            disabled={!updateStartDatetime || !updateEndDatetime}
          >
            Update
          </button>
        </div>
      ) : (
        <div>
          <p>Summary: {props.calendarEvent.summary}</p>
          <p>Description: {props.calendarEvent.description}</p>
          <button onClick={() => setEditingEvent(true)}>Edit</button>
          <button
            onClick={() => handleDeleteCalendarEvent(props.calendarEvent.id)}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}

export default GoogleCalendarEventCard;
