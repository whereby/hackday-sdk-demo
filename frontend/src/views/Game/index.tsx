import { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { useRoomConnection } from "@whereby.com/browser-sdk";

import Participants from "../../components/Participants";
import LobbyView from "../LobbyView";
import { WHEREBY_ROOM } from "../../config/constants";

import useQuizGame, { LocalMediaRef } from "../../useQuizGame";
import QuestionView from "../QuestionView";
import Scoreboard from "../Scoreboard";

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
      case "end":
        return (
          <Scoreboard
            variant={"end"}
            quizState={quizState}
            roomConnection={roomConnection}
          />
        );
      default:
        return <div>Not implemented</div>;
    }
  };

  return (
    <Flex flexDirection="column" height="100%" background="red.200">
      <Box flexGrow="2" height="100%">
        <CurrentScreen />
      </Box>
      <Box flexGrow="1" p="4" background="white">
        <Participants roomConnection={roomConnection} quizState={quizState} />
      </Box>
    </Flex>
  );
};

/**
 * - checkboxes on answered
 * - who answered correct
 * - end scoreboard
 * -
 *
 * bonus
 * - start game
 */

//   <VideoView stream={participant.stream} style={{position: "absolute", top: 2, left: 2}}

export default Game;
