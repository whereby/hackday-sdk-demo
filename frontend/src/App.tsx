import { useState } from "react";
import { Box, position } from "@chakra-ui/react";

import { useLocalMedia } from "@whereby.com/browser-sdk";
import PreCallView from "./views/PreCallView";
import Game from "./views/Game";

import background from "./assets/background2.svg";

import DeviceControls from "./views/DeviceControls";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState("");
  const localMedia = useLocalMedia({ audio: true, video: true });

  const { localStream } = localMedia.state;
  const { toggleCameraEnabled, toggleMicrophoneEnabled } = localMedia.actions;

  return (
    <Box
      h="100%"
      textAlign="center"
      overflow="hidden"
      backgroundImage={`url(${background})`}
      backgroundPosition="center"
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
    >
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

      {localStream && (
        <DeviceControls
          floating={isConnected}
          toggleCameraEnabled={toggleCameraEnabled}
          toggleMicrophoneEnabled={toggleMicrophoneEnabled}
          localStream={localStream}
        />
      )}
    </Box>
  );
}

export default App;
