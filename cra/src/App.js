import { useState } from "react";
import "./App.css";

import {
  useLocalMedia,
  VideoView,
  useRoomConnection,
} from "@whereby.com/browser-sdk";

const WHEREBY_ROOM =
  "https://funtimes.whereby.com/quiz-app8b84481f-02ad-41d3-86dd-05c537e00ed9";

const MyPreCallUX = ({ localMedia }) => {
  const { currentCameraDeviceId, cameraDevices, localStream } =
    localMedia.state;
  const { setCameraDevice, toggleCameraEnabled } = localMedia.actions;

  return (
    <div className="preCallView">
      {/* Render any UI, making use of state */}
      {cameraDevices.map((d) => (
        <p
          key={d.deviceId}
          onClick={() => {
            if (d.deviceId !== currentCameraDeviceId) {
              setCameraDevice(d.deviceId);
            }
          }}
        >
          {d.label}
        </p>
      ))}
      <VideoView muted stream={localStream} />
    </div>
  );
};

const MyVideoCall = ({ localMedia }) => {
  const { state, actions, components } = useRoomConnection(WHEREBY_ROOM, {
    localMedia,
    logger: console,
  });

  const { connectionState, remoteParticipants } = state;
  const { toggleCamera, toggleMicrophone } = actions;
  const { VideoView } = components;

  console.log(connectionState);
  return (
    <div className="videoGrid">
      {/* Render any UI, making use of state */}
      {remoteParticipants.map((p) => (
        <VideoView key={p.id} stream={p.stream} />
      ))}
    </div>
  );
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const localMedia = useLocalMedia({ audio: false, video: true });

  return (
    <div className="App">
      <main>
        <button onClick={() => setIsConnected(!isConnected)}>
          {isConnected ? "Disconnect" : "All good, connect me now!"}
        </button>
        {isConnected ? (
          <MyVideoCall localMedia={localMedia} />
        ) : (
          <MyPreCallUX localMedia={localMedia} />
        )}
      </main>
    </div>
  );
}

export default App;
