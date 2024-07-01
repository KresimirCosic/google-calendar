import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [codeResponse, setCodeResponse] = useState<
    Omit<TokenResponse, "error" | "error_description" | "error_uri"> | undefined
  >(undefined);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setCodeResponse(codeResponse);
    },
  });

  useEffect(() => {
    if (codeResponse) {
      axios
        .get(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
        });
    }
  }, [codeResponse]);

  return (
    <div id="app">
      {codeResponse ? (
        <button>Google logout</button>
      ) : (
        <button onClick={() => login()}>Google login</button>
      )}
    </div>
  );
}

export default App;
