import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { setAccessToken } from "./auth/accessToken";

interface Props {}

const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", { method: "POST", credentials: "include" }).then(
      async res => {
        const { accessToken } = await res.json();
        setAccessToken(accessToken)
        setLoading(false);
      }
    );
  }, []);

  if (loading) return null;

  return <Routes />;
};

export default App;
