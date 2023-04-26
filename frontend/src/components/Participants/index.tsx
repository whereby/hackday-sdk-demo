import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { RoomConnectionRef, GameState } from "../../useQuizGame";

import VideoTile from "../VideoTile";

interface ParticipantsProps {
  roomConnection: RoomConnectionRef;
  quizState: GameState;
}
const Participants = ({ roomConnection, quizState }: ParticipantsProps) => {
  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;
  const { stream: localStream, id: selfId = "" } = localParticipant || {};

  const hasAnswered = !!(
    quizState.currentAnswers && quizState.currentAnswers[selfId]
  );

  console.log(quizState);
  console.log(hasAnswered);

  const MotionFlex = motion(Flex);

  return (
    <MotionFlex>
      <VideoTile stream={localStream} name={"You"} hasAnswered={hasAnswered} />
      {remoteParticipants.map((participant) => {
        const { id, stream, displayName } = participant;
        const hasParticipantAnswered = !!(quizState.currentAnswers || {})[id];
        console.log(hasParticipantAnswered);

        return (
          <VideoTile
            key={id}
            stream={stream}
            name={displayName}
            hasAnswered={hasParticipantAnswered}
          />
        );
      })}
    </MotionFlex>
  );
};

export default Participants;
