import { useState } from "react";

import { useLocalMedia } from "@whereby.com/browser-sdk";

import PreCallView from "./views/PreCallView";
import LobbyView from "./views/LobbyView";

import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const localMedia = useLocalMedia({ audio: false, video: true });

  return (
    <div className="App">
      <main>
        {isConnected ? (
          <LobbyView localMedia={localMedia} />
        ) : (
          <PreCallView
            localMedia={localMedia}
            handleOnReady={() => setIsConnected(true)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
