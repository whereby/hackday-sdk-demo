import { Box, Flex, Wrap } from "@chakra-ui/react";
import AnswerCard from "../../components/AnswerCard";
import QuestionCard from "../../components/QuestionCard";
import VideoTile from "../../components/VideoTile";
import { GameActions, GameState } from "../../useQuizGame";
import { useRoomConnection } from "@whereby.com/browser-sdk";
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
  const hasAnswered = !!(
    quizState.currentAnswers && quizState.currentAnswers[participantId]
  );

  if (shouldReveal) {
    return <p>Reveal answers!</p>;
  }

  if (hasAnswered) {
    return <p>Answered!</p>;
  }

  return (
    <Box
      bgGradient="linear(to-r, grey, blue)"
      alignItems="center"
      justifyContent="center"
      gap={6}
    >
      <QuestionCard
        id="1"
        questionText={quizState.currentQuestion?.question || "No questions yet"}
      ></QuestionCard>

      <Wrap spacing="50px" justify="space-evenly" direction={"row"}>
        {Object.keys(quizState.currentQuestion?.alternatives || {}).map((k) => {
          return (
            <AnswerCard
              key={k}
              locked={hasAnswered}
              answerText={quizState.currentQuestion?.alternatives[k]}
              onSelected={() => quizActions.postAnswer(k)}
            ></AnswerCard>
          );
        })}
      </Wrap>

      <Flex alignItems="center" justifyContent="center">
        <VideoTile stream={localStream} isAnsweredBadge={hasAnswered} />
        {remoteParticipants.map((p) => {
          const { id, stream, displayName } = p;
          const hasParticipantAnswered = !!(quizState.currentAnswers || {})[id];
          return (
            <VideoTile
              key={id}
              stream={stream}
              name={displayName}
              isAnsweredBadge={hasParticipantAnswered}
            />
          );
        })}
      </Flex>
    </Box>
  );
}
