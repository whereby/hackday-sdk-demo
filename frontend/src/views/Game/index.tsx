import { useState } from "react";

import { useRoomConnection } from "@whereby.com/browser-sdk";

import Participants from "../../components/Participants";
import LobbyView from "../LobbyView";
import { WHEREBY_ROOM } from "../../config/constants";

import useQuizGame, { LocalMediaRef } from "../../useQuizGame";
import QuestionView from "../QuestionView";
import EndView from "../EndView";

interface LobbyViewProps {
  localMedia: LocalMediaRef;
}

const Game = ({ localMedia }: LobbyViewProps) => {
  const [gameStarted, setGameStarted] = useState(false);

  const roomConnection = useRoomConnection(WHEREBY_ROOM, {
    localMedia,
    logger: console,
    localMediaConstraints: {
      audio: false,
      video: true,
    },
  });

  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;

  const { state: quizState, actions: quizActions } =
    useQuizGame(roomConnection);

  const CurrentScreen = () => {
    switch (quizState.screen) {
      case "welcome":
        return (
          <LobbyView
            playerCount={remoteParticipants.length + 1}
            onGameReady={() => setGameStarted(true)}
          />
        );
      case "question":
        return (
          <QuestionView
            quizState={quizState}
            quizActions={quizActions}
            localMedia={localMedia}
            roomConnection={roomConnection}
          />
        );
      case "end":
        return <EndView />;
      default:
        return <div>Not implemented</div>;
    }
  };

  return (
    <>
      <CurrentScreen />
      <Participants roomConnection={roomConnection} />
    </>
  );
};
//   <VideoView stream={participant.stream} style={{position: "absolute", top: 2, left: 2}}

export default Game;
