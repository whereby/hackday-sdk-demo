import { useState } from "react";
import { Box } from "@chakra-ui/react";

import { useLocalMedia } from "@whereby.com/browser-sdk";

import PreCallView from "./views/PreCallView";
import LobbyView from "./views/LobbyView";

import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const localMedia = useLocalMedia({ audio: false, video: false });

  return (
    <Box h="100%" textAlign="center">
      {isConnected ? (
        <LobbyView
          localMedia={localMedia}
          onGameReady={() => setGameStarted(true)}
        />
      ) : (
        <PreCallView
          localMedia={localMedia}
          handleOnReady={() => setIsConnected(true)}
        />
      )}
    </Box>
  );
}

export default App;
