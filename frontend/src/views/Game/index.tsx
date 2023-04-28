import { useMemo } from "react";
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
  displayName: string;
}

const urlParams = new URLSearchParams(window.location.search);
const isQuizMaster = !!urlParams.get("quizMaster");

const Game = ({ localMedia, displayName }: LobbyViewProps) => {
  const roomConnection = useRoomConnection(WHEREBY_ROOM, {
    localMedia,
    displayName,
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

  let currentScreen: any = null;

  switch (quizCurrentScreen) {
    case "welcome":
      currentScreen = (
        <LobbyView
          quizActions={quizActions}
          playerCount={remoteParticipants.length + 1}
          isQuizMaster={isQuizMaster}
        />
      );
      break;

    case "question":
      currentScreen = (
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
      break;
    case "end":
      currentScreen = (
        <Scoreboard
          variant={"end"}
          quizState={quizState}
          roomConnection={roomConnection}
        />
      );
      break;
    default:
  }

  return (
    <Flex flexDirection="column" height="100%">
      <Box flexGrow="3">{currentScreen}</Box>
      <Box flexGrow="2" p="4" background="whiteAlpha.500">
        {quizCurrentScreen !== "end" && (
          <Participants roomConnection={roomConnection} quizState={quizState} />
        )}
      </Box>
    </Flex>
  );
};

export default Game;
