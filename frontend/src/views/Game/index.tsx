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
}

const Game = ({ localMedia }: LobbyViewProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const roomConnection = useRoomConnection(WHEREBY_ROOM, {
    localMedia,
    logger: console,
  });

  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;

  const { state: quizState, actions: quizActions } =
    useQuizGame(roomConnection);

  const quizCurrentScreen = useMemo(() => quizState.screen, [quizState.screen]);
  const quizCurrentQuestion = useMemo(
    () => quizState.currentQuestion,
    [quizState.currentQuestion]
  );
  const quizCurrentAnswers = useMemo(
    () => quizState.currentAnswers,
    [quizState.currentAnswers]
  );

  const quizReveal = useMemo(
    () => quizState.revealAnswers,
    [quizState.revealAnswers]
  );

  const quizCurrentAnswer = useMemo(() => {
    const answers = quizState.currentAnswers || {};
    const pid = roomConnection.state.localParticipant?.id || "unknown";
    return answers[pid];
  }, [quizState.currentAnswers, roomConnection.state.localParticipant]);

  const gameState = useMemo(() => quizState, [quizState]);

  console.log("QuizState");
  console.log(quizState);

  const { postAnswer, nextQuestion, revealAnswers } = quizActions;

  const CurrentScreen = () => {
    switch (quizCurrentScreen) {
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
            reveal={quizReveal}
            currentAnswer={quizCurrentAnswer}
            question={quizCurrentQuestion}
            answerQuestion={postAnswer}
            nextQuestionAnswer={nextQuestion}
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
