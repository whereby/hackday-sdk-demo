import { useState } from "react";
import { motion } from "framer-motion";
import { useLocalMedia, VideoView } from "@whereby.com/browser-sdk";

import "./App.css";

import {
  useLocalMedia,
  VideoView,
  useRoomConnection,
} from "@whereby.com/browser-sdk";

import { PreCallSetup, SelfView } from "./components/PreCall";

const WHEREBY_ROOM =
  "https://funtimes.whereby.com/quiz-app8b84481f-02ad-41d3-86dd-05c537e00ed9";

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
      <div>
        <SelfView localMedia={localMedia}></SelfView>
        <span>you</span>
      </div>

      {remoteParticipants.map((p) => (
        <div>
          <motion.div animate={{ x: 100 }} whileHover={{ scale: 1.2 }}>
            <VideoView key={p.id} stream={p.stream} />
            <span>Participant {p.id}</span>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  // const [numParticipants, setNumParticipants] = useState(0);
  const localMedia = useLocalMedia({ audio: false, video: true });

  return (
    <div className="App">
      <main>
        {isConnected ? (
          <MyVideoCall localMedia={localMedia} />
        ) : (
          <PreCallSetup localMedia={localMedia} />
        )}
        <button onClick={() => setIsConnected(!isConnected)}>
          {isConnected ? "Disconnect" : "All good, connect me now!"}
        </button>
      </main>
    </div>
  );
}

export default App;
