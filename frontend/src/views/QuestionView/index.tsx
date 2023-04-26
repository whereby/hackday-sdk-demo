import {
  Box,
  Flex,
  Wrap,
} from "@chakra-ui/react";
import AnswerCard from "../../components/AnswerCard";
import QuestionCard from "../../components/QuestionCard";
import VideoTile from "../../components/VideoTile";

export default function QuestionView({ quizState, localMedia, roomConnection }) {

  const { state } = roomConnection;
  const {remoteParticipants } = state;
  const { localStream } = localMedia.state;
  
  console.log("quizState", quizState);
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
            <AnswerCard key={k}
              answerText={quizState.currentQuestion?.alternatives[k]}
            ></AnswerCard>
          );
        })}
      </Wrap>

      <Flex alignItems="center"  justifyContent="center">
      <VideoTile stream={localStream} isAnsweredBadge={true}/>
        {remoteParticipants.map((p) => {
          const { id, stream, displayName } = p;
          return <VideoTile key={id} stream={stream} name={displayName} />;
        })}
      </Flex>
    </Box>
  );
}
