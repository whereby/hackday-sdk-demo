import { Box, Flex, Wrap, Center, Heading } from "@chakra-ui/react";
import AnswerCard from "../../components/AnswerCard";
import QuestionCard from "../../components/QuestionCard";
import Title from "../../components/Title";
import VideoTile from "../../components/VideoTile";
import { motion } from "framer-motion";
import { GameActions, GameState } from "../../useQuizGame";
import { useRoomConnection } from "@whereby.com/browser-sdk";
import { current } from "@reduxjs/toolkit";
type RoomConnectionRef = ReturnType<typeof useRoomConnection>;

export default function QuestionView({
  quizState,
  localMedia,
  roomConnection,
  quizActions,
}: {
  quizState: GameState;
  localMedia: any;
  roomConnection: RoomConnectionRef;
  quizActions: GameActions;
}) {
  const { state } = roomConnection;
  const { remoteParticipants } = state;
  const { localStream } = localMedia.state;

  const shouldReveal = quizState.revealAnswers;
  const participantId = roomConnection.state.localParticipant?.id || "unknown";
  const currentAnswer =
    quizState?.currentAnswers?.[participantId]?.["alternative"] ?? null;
  console.log("Current answer", currentAnswer);

  const MotionBox = motion(Box);

  const boxVariants = {
    visible: {
      backgroundColor: ["#60F", "#09F", "#FA0"],
      transition: {
        delay: 1,
        duration: 2,
        ease: [0.075, 0.82, 0.165, 1],
        // repeat: Infinity,
        // repeatType: "reverse",
      },
    },
  };

  return (
    <MotionBox
      // bgGradient="linear(to-r, grey, blue)"
      // alignItems="center"
      // justifyContent="center"
      // background="purple.200"
      gap={6}
      height="100%"
      variants={boxVariants}
      animate="visible"
      p="10"
    >
      <Heading>
        <Title>
          {quizState.currentQuestion?.question || "No questions yet"}
        </Title>
      </Heading>
      {/* TODO: use question view to change bg colour */}
      {/* <QuestionCard
        id="1"
        questionText={quizState.currentQuestion?.question || "No questions yet"}
      /> */}

      <Center justifyContent="space-evenly" alignItems="center" h="100%">
        {Object.keys(quizState.currentQuestion?.alternatives || {}).map((k) => {
          return (
            <AnswerCard
              key={k}
              locked={!!currentAnswer}
              isSelected={currentAnswer === k}
              answerText={quizState.currentQuestion?.alternatives[k]}
              onSelected={() => quizActions.postAnswer(k)}
            />
          );
        })}
      </Center>
    </MotionBox>
  );
}

// <Flex alignItems="center" justifyContent="center">
//   <VideoTile stream={localStream} hasAnswered={hasAnswered} />
//   {remoteParticipants.map((p) => {
//     const { id, stream, displayName } = p;
//     const hasParticipantAnswered = !!(quizState.currentAnswers || {})[id];
//     return (
//       <VideoTile
//         key={id}
//         stream={stream}
//         name={displayName}
//         hasAnswered={hasParticipantAnswered}
//       />
//     );
//   })}
// </Flex>
