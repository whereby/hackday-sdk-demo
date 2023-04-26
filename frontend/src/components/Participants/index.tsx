import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { RoomConnectionRef } from "../../useQuizGame";
import VideoTile from "../VideoTile";

interface ParticipantsProps {
  roomConnection: RoomConnectionRef;
}
const Participants = ({ roomConnection }: ParticipantsProps) => {
  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;
  const { stream: localStream } = localParticipant || {};

  return (
    <Flex>
      <VideoTile stream={localStream} name={"You"} />
      {remoteParticipants.map((participant) => {
        const { id, stream, displayName } = participant;
        return <VideoTile key={id} stream={stream} name={displayName} />;
      })}
    </Flex>
  );
};

export default Participants;
