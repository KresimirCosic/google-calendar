import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";

import "./App.css";
import { GoogleApiResponse, GoogleCalendarEvent } from "./types";

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
   * Google auth
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

  /**
   * Side effects
   */
  useEffect(() => {
    if (tokenResponse) {
      fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
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
          </div>

          <br />

          <ul>
            {calendarEvents.map((calendarEvent) => (
              <li key={calendarEvent.id}>
                <p>Summary: {calendarEvent.summary}</p>
                <p>Description: {calendarEvent.description}</p>
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
