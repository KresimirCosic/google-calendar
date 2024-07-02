import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [tokenResponse, setTokenResponse] = useState<
    Omit<TokenResponse, "error" | "error_description" | "error_uri"> | undefined
  >(undefined);
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

  useEffect(() => {
    if (tokenResponse) {
      axios
        .get(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
        });
    }
  }, [tokenResponse]);

  return (
    <div id="app">
      {tokenResponse ? (
        <button onClick={() => logout()}>Google logout</button>
      ) : (
        <button onClick={() => login()}>Google login</button>
      )}
    </div>
  );
}

export default App;
