import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";

import "./App.css";
import GoogleCalendarEventCard from "./components/GoogleCalendarEventCard/GoogleCalendarEventCard";
import { googleCalendarEventBaseApiUrl } from "./constants/google";
import { Action } from "./enums/action";
import {
  CreateCalendarEventBody,
  GoogleApiResponse,
  GoogleCalendarEvent,
  Payload,
} from "./types";

function App() {
  /**
   * State
   */
  const [tokenResponse, setTokenResponse] = useState<
    Omit<TokenResponse, "error" | "error_description" | "error_uri"> | undefined
  >(undefined);
  const [isGettingAllCalendarEvents, setIsGettingAllCalendarEvents] =
    useState(false);
  const [createEventName, setCreateEventName] = useState("");
  const [createEventDescription, setCreateEventDescription] = useState("");
  const [createStartDatetime, setCreateStartDatetime] = useState<Date>(
    new Date()
  );
  const [createEndDatetime, setCreateEndDatetime] = useState<Date>(new Date());
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
  const getAllCalendarEvents = () => {
    if (tokenResponse) {
      setCalendarEvents([]);
      setIsGettingAllCalendarEvents(true);

      fetch(`${googleCalendarEventBaseApiUrl}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data: GoogleApiResponse<GoogleCalendarEvent[]>) => {
          setCalendarEvents(data.items);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsGettingAllCalendarEvents(false);
        });
    }
  };
  const createCalendarEvent = () => {
    if (tokenResponse) {
      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      const body: CreateCalendarEventBody = {
        start: {
          dateTime: createStartDatetime.toISOString(),
          timeZone,
        },
        end: {
          dateTime: createEndDatetime.toISOString(),
          timeZone,
        },
        summary: createEventName,
        description: createEventDescription,
      };

      fetch(googleCalendarEventBaseApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data: GoogleCalendarEvent) => {
          resetCreateForm();
          getAllCalendarEvents();

          const body: Payload = {
            eventId: data.id,
            action: Action.CREATE,
          };

          fetch("/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        })
        .catch((error) => console.error(error));
    }
  };
  const resetCreateForm = () => {
    setCreateEventName("");
    setCreateEventDescription("");
  };

  /**
   * Side effects
   */
  useEffect(() => {
    getAllCalendarEvents();
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
              value={createStartDatetime}
              onChange={(value) => {
                setCreateStartDatetime(value as Date);
              }}
            />
            <br />
            <p>End datetime*:</p>
            <DateTimePicker
              value={createEndDatetime}
              onChange={(value) => {
                setCreateEndDatetime(value as Date);
              }}
            />
            <br />
            <p>
              Event summary <small>(optional)</small>:
            </p>
            <input
              type="text"
              value={createEventName}
              onChange={(event) => setCreateEventName(event.target.value)}
            />
            <br />
            <p>
              Event description <small>(optional)</small>:
            </p>
            <input
              type="text"
              value={createEventDescription}
              onChange={(event) =>
                setCreateEventDescription(event.target.value)
              }
            />

            <br />
            <br />

            <button
              onClick={createCalendarEvent}
              disabled={!createStartDatetime || !createEndDatetime}
            >
              Create
            </button>
          </div>

          <br />

          {isGettingAllCalendarEvents ? (
            <h2>Loading events...</h2>
          ) : (
            <ul>
              {calendarEvents.map((calendarEvent) => (
                <GoogleCalendarEventCard
                  key={calendarEvent.id}
                  tokenResponse={tokenResponse}
                  calendarEvent={calendarEvent}
                  getAllCalendarEvents={getAllCalendarEvents}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <button onClick={() => login()}>Google login</button>
      )}
    </div>
  );
}

export default App;
