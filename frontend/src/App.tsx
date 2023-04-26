import { useState } from "react";
import { Box } from "@chakra-ui/react";

import { useLocalMedia } from "@whereby.com/browser-sdk";
import PreCallView from "./views/PreCallView";
import Game from "./views/Game";

import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const localMedia = useLocalMedia({ audio: false, video: true });

  return (
    <Box h="100%" textAlign="center">
      {!isConnected ? (
        <PreCallView
          localMedia={localMedia}
          handleOnReady={() => setIsConnected(true)}
        />
      ) : (
        <Game localMedia={localMedia} />
      )}
    </Box>
  );
}

export default App;
