import React, { memo } from "react";
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

  const MotionFlex = motion(Flex);

  return (
    <MotionFlex gap="4">
      <VideoTile stream={localStream} name={"You"} hasAnswered={hasAnswered} />
      {remoteParticipants.map((participant, i) => {
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

export default memo(Participants);
