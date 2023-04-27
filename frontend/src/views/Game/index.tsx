import { useState, useMemo } from "react";
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
  name: string;
}

const urlParams = new URLSearchParams(window.location.search);
const isQuizMaster = !!urlParams.get("quizMaster");

const Game = ({ localMedia, name }: LobbyViewProps) => {
  const roomConnection = useRoomConnection(WHEREBY_ROOM, {
    localMedia,
    displayName: name,
    logger: console,
  });

  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;

  const { state: quizState, actions: quizActions } = useQuizGame(
    roomConnection,
    { isQuizMaster }
  );

  const quizCurrentScreen = useMemo(() => quizState.screen, [quizState.screen]);
  const quizCurrentQuestion = useMemo(
    () => quizState.currentQuestion,
    [quizState.currentQuestion]
  );

  const quizReveal = useMemo(
    () => quizState.revealAnswers,
    [quizState.revealAnswers]
  );

  const quizCurrentAnswer = useMemo(() => {
    const answers = quizState.currentAnswers || {};
    const pid = localParticipant?.id || "unknown";
    return answers[pid];
  }, [localParticipant?.id, quizState.currentAnswers]);

  const { postAnswer, nextQuestion, revealAnswers } = quizActions;

  const CurrentScreen = () => {
    switch (quizCurrentScreen) {
      case "welcome":
        return (
          <LobbyView
            quizActions={quizActions}
            playerCount={remoteParticipants.length + 1}
            isQuizMaster={isQuizMaster}
          />
        );
      case "question":
        return (
          <QuestionView
            isQuizMaster={isQuizMaster}
            reveal={quizReveal}
            currentAnswer={quizCurrentAnswer}
            question={quizCurrentQuestion}
            answerQuestion={postAnswer}
            nextQuestionAction={nextQuestion}
            revealQuestionAnswers={revealAnswers}
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
    <Flex
      flexDirection="column"
      height="100%"
      //  background="red.200"
    >
      <Box flexGrow="3" height="100%">
        <CurrentScreen />
      </Box>
      <Box flexGrow="2" p="4" background="whiteAlpha.500">
        {quizCurrentScreen !== "end" && (
          <Participants roomConnection={roomConnection} quizState={quizState} />
        )}
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
