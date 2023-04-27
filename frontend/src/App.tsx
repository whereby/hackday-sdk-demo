import { useState } from "react";
import { Box, position } from "@chakra-ui/react";

import { useLocalMedia } from "@whereby.com/browser-sdk";
import PreCallView from "./views/PreCallView";
import Game from "./views/Game";

import "./App.css";
import DeviceControls from "./views/DeviceControls";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState("");
  const localMedia = useLocalMedia({ audio: false, video: false });

  const { localStream } = localMedia.state;
  const { toggleCameraEnabled, toggleMicrophoneEnabled } = localMedia.actions;

  return (
    <Box h="100%" textAlign="center" overflow="hidden">
      {!isConnected ? (
        <PreCallView
          localMedia={localMedia}
          handleOnReady={(name) => {
            setName(name);
            setIsConnected(true);
          }}
        />
      ) : (
        <Game localMedia={localMedia} name={name} />
      )}
      <Box position="absolute" left="0" bottom="0">
        {localStream && (
          <DeviceControls
            floating={isConnected}
            toggleCameraEnabled={toggleCameraEnabled}
            toggleMicrophoneEnabled={toggleMicrophoneEnabled}
            localStream={localStream}
          />
        )}
      </Box>
    </Box>
  );
}

export default App;
