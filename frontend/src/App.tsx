import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";

import "./App.css";
import {
  CreateCalendarEventBody,
  GoogleApiResponse,
  GoogleCalendarEvent,
} from "./types";
import { googleCalendarEventBaseApiUrl } from "./constants/google";

function App() {
  /**
   * State
   */
  const [tokenResponse, setTokenResponse] = useState<
    Omit<TokenResponse, "error" | "error_description" | "error_uri"> | undefined
  >(undefined);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [startDatetime, setStartDatetime] = useState<Date>(new Date());
  const [endDatetime, setEndDatetime] = useState<Date>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>(
    []
  );

  /**
   * Methods
   */
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setTokenResponse(tokenResponse);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const logout = () => {
    googleLogout();
    setTokenResponse(undefined);
  };
  const createCalendarEvent = () => {
    if (tokenResponse) {
      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      const body: CreateCalendarEventBody = {
        start: {
          dateTime: startDatetime.toISOString(),
          timeZone,
        },
        end: {
          dateTime: endDatetime.toISOString(),
          timeZone,
        },
        summary: eventName,
        description: eventDescription,
      };

      fetch(googleCalendarEventBaseApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          resetCreateForm();
        })
        .catch((error) => console.error(error));
    }
  };
  const updateCalendarEvent = (id: string) => {
    if (tokenResponse) {
      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      const body: CreateCalendarEventBody = {
        start: {
          dateTime: startDatetime.toISOString(),
          timeZone,
        },
        end: {
          dateTime: endDatetime.toISOString(),
          timeZone,
        },
        summary: eventName,
        description: eventDescription,
      };

      fetch(`${googleCalendarEventBaseApiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        method: "PUT",
        body: JSON.stringify(body),
      });
    }
  };
  const deleteCalendarEvent = (id: string) => {
    if (tokenResponse) {
      fetch(`${googleCalendarEventBaseApiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        method: "DELETE",
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.error(error));
    }
  };
  const resetCreateForm = () => {
    setEventName("");
    setEventDescription("");
  };

  /**
   * Side effects
   */
  useEffect(() => {
    if (tokenResponse) {
      fetch("${googleCalendarEventBaseApiUrl}", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data: GoogleApiResponse<GoogleCalendarEvent[]>) => {
          setCalendarEvents(data.items);
        })
        .catch((error) => console.error(error));
    }
  }, [tokenResponse]);

  return (
    <div id="app">
      {tokenResponse ? (
        <>
          <button onClick={() => logout()}>Google logout</button>

          <br />

          <div id="create-event">
            <h1>Create an event</h1>
            <p>Start datetime*:</p>
            <DateTimePicker
              value={startDatetime}
              onChange={(value) => {
                setStartDatetime(value as Date);
              }}
            />
            <br />
            <p>End datetime*:</p>
            <DateTimePicker
              value={endDatetime}
              onChange={(value) => {
                setEndDatetime(value as Date);
              }}
            />
            <br />
            <p>
              Event summary <small>(optional)</small>:
            </p>
            <input
              type="text"
              value={eventName}
              onChange={(event) => setEventName(event.target.value)}
            />
            <br />
            <p>
              Event description <small>(optional)</small>:
            </p>
            <input
              type="text"
              value={eventDescription}
              onChange={(event) => setEventDescription(event.target.value)}
            />

            <br />
            <br />

            <button onClick={createCalendarEvent}>Create</button>
          </div>

          <br />

          <ul>
            {calendarEvents.map((calendarEvent) => (
              <li key={calendarEvent.id}>
                <p>Summary: {calendarEvent.summary}</p>
                <p>Description: {calendarEvent.description}</p>
                <button onClick={() => updateCalendarEvent(calendarEvent.id)}>
                  Update
                </button>
                <button onClick={() => deleteCalendarEvent(calendarEvent.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={() => login()}>Google login</button>
      )}
    </div>
  );
}

export default App;
