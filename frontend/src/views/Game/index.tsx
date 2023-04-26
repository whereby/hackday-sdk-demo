import { useState } from "react";

import { useRoomConnection } from "@whereby.com/browser-sdk";

import Participants from "../../components/Participants";
import LobbyView from "../LobbyView";
import { WHEREBY_ROOM } from "../../config/constants";

import useQuizGame, { LocalMediaRef } from "../../useQuizGame";
import QuestionView from "../QuestionView";

interface LobbyViewProps {
  localMedia: LocalMediaRef;
}

const Game = ({ localMedia }: LobbyViewProps) => {
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
            quizActions={quizActions}
            playerCount={remoteParticipants.length + 1}
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
      default:
        return <div>Not implemented</div>;
    }
  };

  return (
    <>
      <CurrentScreen />
      <Participants roomConnection={roomConnection} quizState={quizState} />
    </>
  );
};
//   <VideoView stream={participant.stream} style={{position: "absolute", top: 2, left: 2}}

export default Game;
